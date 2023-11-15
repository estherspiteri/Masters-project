from flask import current_app, Response
import pandas as pd
from Bio import Entrez
import requests

from server.responses.internal_response import InternalResponse


# convert variant list to VCF format
def convert_variants_to_vcf(variant_df: pd.DataFrame):
    with open('variants.vcf', 'w') as vcf_f:
        for var in variant_df.iterrows():
            vcf_string = f"{var[1]['Chr']} {var[1]['Position']} . {var[1]['Reference']} {var[1]['Observed Allele']} . PASS\n"
            vcf_f.write(vcf_string)


def get_rsids(genome_version: str) -> InternalResponse:
    # retrieve RSIDs if they exist for a given variant
    url = f"https://api.ncbi.nlm.nih.gov/variation/v0/vcf/file/set_rsids?assembly={genome_version}"
    myfiles = {'file': open('variants.vcf', 'rb')}
    rsid_vcf_res = requests.post(url, files=myfiles)

    if rsid_vcf_res.status_code != 200:
        current_app.logger.error(f'NCBI Variation Service failed: {rsid_vcf_res.reason}')
        return InternalResponse(None, rsid_vcf_res.status_code, rsid_vcf_res.reason)
    else:
        #TODO: save updated file with rsids (overwrite initially created file)?

        # extract RSIDs
        # skip empty lines (x.strip()) - trying to split an empty line can lead to an "index out of range" error
        rsids = [x.split()[2] for x in rsid_vcf_res.text.split('\n') if
                 x.strip()]  # columns: 'chromosome', 'position', 'rsid', 'reference', 'observed'

        return InternalResponse(rsids, 200)


# Function to get variant info from dbSNP
def get_dbsnp_variant_info(rsid: str) -> InternalResponse:
    variant_id = None
    variant_record = None

    try:
        # look up rsid in dbSNP
        search_results_handle = Entrez.esearch(db="snp", term=rsid)
        search_results = Entrez.read(search_results_handle)
        search_results_handle.close()

        # assuming top most result is most relevant
        if len(search_results['IdList']) > 0:
            variant_id = search_results['IdList'][0]
    except IOError as e:
        current_app.logger.error(f'Network error when calling Entrez.esearch(): {str(e)}')
        return InternalResponse(None, e.errno, str(e))

    if variant_id is not None:
        try:
            # retrieving most relevant variant's info
            variant_handle = Entrez.esummary(db="snp", id=variant_id)
            variant_record = Entrez.read(variant_handle)
            variant_handle.close()
        except IOError as e:
            current_app.logger.error(f'Network error when calling Entrez.efetch(): {str(e)}')
            return InternalResponse(None, e.errno, str(e))

    return InternalResponse(variant_record, 200)


# Function to get genes from dbSNP variant info
def get_genes_from_dbsnp_info(dbsnp_info):
    gene_names = []

    if dbsnp_info:
        # assuming first document summary is the most relevant
        genes = dbsnp_info['DocumentSummarySet']['DocumentSummary'][0]['GENES']

        gene_names = [gene['NAME'] for gene in genes]

    return gene_names


# Function to get chromosome and chromosome position from dbSNP variant info
def get_chr_pos_from_dbsnp_info(dbsnp_info):
    chr = ''
    pos = ''

    if dbsnp_info:
        # assuming first document summary is the most relevant
        chr_pos = dbsnp_info['DocumentSummarySet']['DocumentSummary'][0]['CHRPOS_PREV_ASSM']
        chr_pos_split = chr_pos.split(':')

        chr = chr_pos_split[0]
        pos = chr_pos_split[1]

    return {'CHR': chr, 'POS': pos}


# Function to get Reference and Observed alleles from dbSNP - ONLY WORKS FOR SNV aka REF>OBSERVED
def get_alleles_from_dbsnp_info(dbsnp_info, pos):
    ref_observed = []
    matching_pos_doc_sum = []

    if dbsnp_info:
        # assuming first document summary is the most relevant
        doc_sum_array = dbsnp_info['DocumentSummarySet']['DocumentSummary'][0]['DOCSUM'].split(',')
        matching_pos_doc_sum = [doc_sum for doc_sum in doc_sum_array if pos in doc_sum]

        for doc_sum in matching_pos_doc_sum:
            # parsing hgvs notation to access reference and observed allele
            ref_observed_allele = ''.join([x for x in doc_sum.split(':')[1].split('.')[1] if not x.isdigit()])

            if '>' in ref_observed_allele:
                ref_observed_allele_split = ref_observed_allele.split('>')

                ref_observed.append({'REF': ref_observed_allele_split[0], 'OBSERVED': ref_observed_allele_split[1]})

    return ref_observed, matching_pos_doc_sum


# Function to verify that the rsid matches with the requested variant using dbSNP
def verify_rsid(rsid: str, genes: str, chr: str, pos: str, ref: str, observed: str) -> InternalResponse:
    is_valid = True

    db_snp_variant_info_res = get_dbsnp_variant_info(rsid)

    if db_snp_variant_info_res.status != 200:
        current_app.logger.error(f'Retrieval of variant info from dbSNP failed!')
        return InternalResponse(None, 500)
    else:
        db_snp_variant_info = db_snp_variant_info_res.data

        if db_snp_variant_info is not None:
            # compare genes
            genes_list = get_genes_from_dbsnp_info(db_snp_variant_info)

            # flag that indicates whether at least one of the variant's genes matched the RSID's genes
            is_gene_found = False
            for gene in genes.split(','):
                if gene in genes_list:
                    is_gene_found = True
                    break

            if not is_gene_found:
                current_app.logger.warn(f"{rsid}: Variant's genes {genes} do not match the RSID's genes {genes_list}!")
                is_valid = False

            # compare chromosome and chromosome position
            chr_pos = get_chr_pos_from_dbsnp_info(db_snp_variant_info)

            if chr_pos['CHR'] != chr:
                current_app.logger.warn(
                    f"{rsid}: Variant's chromosome {chr} does not match RSID's chromosome {chr_pos['CHR']}!")
                is_valid = False

            if chr_pos['POS'] != pos:
                current_app.logger.warn(
                    f"{rsid}: Variant's chromosome position {pos} does not match RSID's chromosome position {chr_pos['POS']}!")
                is_valid = False

            # compare reference and observed allele
            ref_observed_allele_array = get_alleles_from_dbsnp_info(db_snp_variant_info, chr_pos['POS'])

            ref_observed_allele_match = False

            for ref_observed_allele in ref_observed_allele_array[0]:
                if ref_observed_allele['REF'] == ref and ref_observed_allele['OBSERVED'] == observed:
                    ref_observed_allele_match = True
                    break

            if not ref_observed_allele_match:
                current_app.logger.warn(
                    f"{rsid}: Variant's reference {ref} and/or observed allele {observed} do not match any of the RSID's reference and observed alleles {ref_observed_allele_array[1]}!")
                is_valid = False
        else:
            current_app.logger.warn(f"{rsid}: No variant info found in dbSNP!")
            is_valid = False

        return InternalResponse(is_valid, 200)


def get_rsids_from_dbsnp(vus_df: pd.DataFrame) -> InternalResponse:
    # generate VCF string for VUS
    convert_variants_to_vcf(vus_df)

    get_rsids_res: InternalResponse = get_rsids('GRCh37.p13')

    if get_rsids_res.status != 200:
        current_app.logger.error(
            f'Get RSIDs query failed 500')
        return InternalResponse(None, 500)
    else:
        # get variant RSIDs
        vus_df['RSID'] = get_rsids_res.data

        # check validity of RSIDs
        rsid_verification = []

        for index, row in vus_df.iterrows():
            if row['RSID'] == 'NORSID':
                rsid_verification.append(False)
            else:
                verify_rsid_res = verify_rsid(row['RSID'], row['Gene'], row['Chr'], row['Position'], row['Reference'],
                                row['Observed Allele'])

                if verify_rsid_res.status != 200:
                    current_app.logger.error(f"RSID verification for {row['RSID']}  failed 500")
                    return InternalResponse(None, 500)
                else:
                    rsid_verification.append(verify_rsid_res.data)

        # create a column which shows if an rsid is verified successfully or not (rsid variant matches details of inputted variant)
        vus_df['RSID dbSNP verified'] = rsid_verification

        return InternalResponse(vus_df, 200)
