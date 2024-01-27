from datetime import datetime
from typing import List, Hashable

from flask import current_app, Response
import pandas as pd
from Bio import Entrez
from sqlalchemy.exc import SQLAlchemyError, MultipleResultsFound
from werkzeug.datastructures import FileStorage
import json

from server import db
from server.helpers.data_helper import prep_vus_df_for_react, convert_df_to_list
from server.models import Variants, GeneAnnotations, GeneAttributes, DbSnp, \
    Clinvar, ExternalReferences, SampleFiles, Samples, VariantsSamples, Genotype
from server.responses.internal_response import InternalResponse
from server.services.dbsnp_service import get_rsids_from_dbsnp

from server.services.clinvar_service import retrieve_clinvar_variant_classifications

Entrez.email = "esther.spiteri.18@um.edu.mt"


# TODO: fn can be eliminated later on since user will be asked which of the genes he/she would like to use

# generate separate records for each gene when a VUS has multiple genes
def handle_vus_with_multiple_genes(vus_df: pd.DataFrame):
    multiple_genes = []
    rows_to_delete = []
    new_rows_dictionaries = []
    var_id = 0

    # insert id column so that variants with multiple genes have multiple entries in the dataframe with the same id
    vus_df.insert(0, 'VUS Id', 0)

    # make a copy of the dataframe to be able to iterate through it whilst modifying the original dataframe
    new_vus_df = vus_df.copy()

    # note VUS with multiple genes and generate records for each gene (same VUS ID)
    for index, row in new_vus_df.iterrows():
        # set variant id
        vus_df.at[index, 'VUS Id'] = var_id

        # get the gene name
        gene_string = row['Gene']
        genes = gene_string.split(',')

        # note if variant has multiple genes
        filtered_genes = [g for g in genes if 'AS1' not in g and 'LOC' not in g]
        if len(filtered_genes) > 1:
            multiple_genes.append(var_id)

        if len(genes) > 1:
            rows_to_delete.append(index)

            # create a variant record for every gene
            for i, gene in enumerate(genes):
                # exclude anti-sense and locus
                if 'AS1' not in gene and 'LOC' not in gene:
                    new_row = row.copy().to_dict()
                    new_row['Gene'] = gene
                    new_row['VUS Id'] = var_id
                    new_rows_dictionaries.append(new_row)

        # increment variant id
        var_id += 1

        # TODO: handle cases where not SNVs

    current_app.logger.info(f"Percentage of VUS with multiple genes: {round(len(multiple_genes) / var_id * 100, 2)}%\n"
                            f"VUS IDs of VUS with multiple genes: {[g for g in multiple_genes]}")

    # clean up - remove multiple gene records (since they will be replaced by individual records)
    # drop rows containing variants with multiple genes (including those with AS1 and LOC)
    vus_df = vus_df.drop([g for g in rows_to_delete])
    vus_df = vus_df.reset_index(drop=True)

    # insert row for every one of the multiple genes
    for r in new_rows_dictionaries:
        df_dictionary = pd.DataFrame([r])
        vus_df = pd.concat([vus_df, df_dictionary], ignore_index=True)

    # sort the dataframe by the 'VUS Id' column in ascending order
    vus_df = vus_df.sort_values(by='VUS Id')

    # reset the indices to maintain a continuous index
    vus_df = vus_df.reset_index(drop=True)

    return vus_df


# create columns for chromosome and chromosome position
def extract_chr_and_position(vus_df: pd.DataFrame):
    # create new columns for chromosome and position and initialize it with empty strings
    vus_df.insert(1, 'Chr', "")
    vus_df.insert(2, 'Position', "")

    # make a copy of the dataframe to be able to iterate through it whilst modifying the original dataframe
    new_vus_df = vus_df.copy()

    # iterate through the dataframe and add entries to the chromosome and position column based on the locus column
    for index, row in new_vus_df.iterrows():
        # get the chromosome and the chromosome position from the locus
        locus = row['Locus']
        locus_arr = locus.split(':')

        vus_df.at[index, 'Chr'] = locus_arr[0].split('chr')[1]
        vus_df.at[index, 'Position'] = locus_arr[1]

    # remove locus column
    vus_df = vus_df.drop(columns=['Locus'])

    return vus_df


def filter_vus(vus_df: pd.DataFrame) -> pd.DataFrame:
    # exclude technical artifacts and CNVs
    vus_df = vus_df[vus_df['Classification'].str.contains('TECHNICAL_ARTIFACT', case=False, regex=True) == False]
    vus_df = vus_df[vus_df['Type'].str.contains('CNV|LONGDEL', case=False, regex=True) == False]

    # remove variant id column
    vus_df = vus_df.drop(columns=['Variant Id'])

    # remove flag type column
    vus_df = vus_df.drop(columns=['FlagType'])

    vus_df = extract_chr_and_position(vus_df)

    # TODO: store in db

    return vus_df


def get_rsids(vus_df: pd.DataFrame):
    get_rsids_from_dbsnp_res = get_rsids_from_dbsnp(vus_df)

    if get_rsids_from_dbsnp_res.status != 200:
        current_app.logger.error(
            f'Get RSIDs from dbSNP query failed 500')
        return InternalResponse(None, 500)
    else:
        vus_df = get_rsids_from_dbsnp_res.data

        vus_df = handle_vus_with_multiple_genes(
            vus_df)  # TODO: is this correct location? should it be included with RSID retrieval process? [needs to be done after rsids]

        # write dataframe to excel file
        # TODO: write to database
        # vus_df.to_excel('rsid_vus.xlsx', index=False)

        return InternalResponse(vus_df, 200)


def get_gene_ids(vus_df: pd.DataFrame) -> pd.DataFrame:
    # create new column for gene id and initialize it with empty strings
    vus_df.insert(3, 'Gene Id', "")

    # make a copy of the dataframe to be able to iterate through it whilst modifying the original dataframe
    new_vus_df = vus_df.copy()

    # iterate through the dataframe
    for index, row in new_vus_df.iterrows():
        # Retrieving gene ids from Gene Annotations table where the VUS is located
        gene_ids: List[GeneAnnotations.gene_id] = db.session.query(GeneAnnotations.gene_id).filter(
            GeneAnnotations.seq_name == row['Chr'],
            row['Position'] >= GeneAnnotations.start_location,
            GeneAnnotations.end_location >= row['Position']
        ).all()

        for gene_id in gene_ids:
            # Retrieving gene name from Gene Attributes table where the VUS is located
            gene_attributes: GeneAttributes = db.session.query(GeneAttributes).filter(
                GeneAttributes.gene_id == gene_id[0],
                GeneAttributes.attribute_name == 'gene_name'
            ).one()

            if gene_attributes.attribute_value not in row['Gene']:
                print(f'The following row:\n {row} \nhas  a gene which does not match the gene found in our database '
                      f'with id:{gene_id} and name:{gene_attributes.attribute_value}')

        if len(gene_ids) > 1:
            print(f'The following row:\n {row} \nhas multiple gene ids: {gene_ids}')
        elif len(gene_ids) == 0:
            print(f'The following row:\n {row} \nhas no gene ids')
        else:
            # TODO: handle multiple genes
            # TODO: handle mismatch genes
            # for now select the first gene
            vus_df.at[index, 'Gene Id'] = gene_ids[0][0]

    return vus_df


def get_external_references(variant_id: int, index: Hashable, vus_df: pd.DataFrame) -> pd.DataFrame:
    # retrieve all external references related to that variant
    external_references: List[ExternalReferences] = db.session.query(ExternalReferences).filter(
        ExternalReferences.variant_id == variant_id
    ).all()

    for ref in external_references:
        if ref.db_type == 'db_snp':
            # retrieve dbsnp entry related to the variant
            dbsnp: DbSnp = db.session.query(DbSnp).filter(
                DbSnp.external_references_id == ref.external_references_id
            ).one_or_none()

            vus_df.at[index, 'RSID'] = dbsnp.db_snp_id
            vus_df.at[index, 'RSID dbSNP verified'] = len(ref.error_msg) == 0
            vus_df.at[index, 'RSID dbSNP errorMsgs'] = ref.error_msg

        elif ref.db_type == 'clinvar':
            # retrieve clinvar entry related to the variant
            clinvar: Clinvar = db.session.query(Clinvar).filter(
                Clinvar.external_references_id == ref.external_references_id
            ).one_or_none()

            if clinvar.last_evaluated is not None:
                clinvar_last_evaluated = datetime.strftime(clinvar.last_evaluated, '%Y/%m/%d %H:%M')
            else:
                clinvar_last_evaluated = None

            # populate the clinvar fields
            vus_df.at[index, 'Clinvar uid'] = clinvar.clinvar_id
            vus_df.at[index, 'Clinvar canonical spdi'] = clinvar.canonical_spdi
            vus_df.at[index, 'Clinvar classification'] = clinvar.classification
            vus_df.at[index, 'Clinvar classification review status'] = clinvar.review_status
            vus_df.at[index, 'Clinvar classification last eval'] = clinvar_last_evaluated
            vus_df.at[index, 'Clinvar error msg'] = ref.error_msg

    return vus_df


def check_for_existing_variants(vus_df: pd.DataFrame) -> (pd.DataFrame, pd.DataFrame, List[int]):
    existing_variant_ids = []

    # make a copy of the dataframe to be able to iterate through it whilst modifying the original dataframe
    new_vus_df = vus_df.copy()

    # iterate through the dataframe
    for index, row in new_vus_df.iterrows():

        try:
            # retrieve variant if it already exists in DB
            variant: Variants = db.session.query(Variants).filter(
                Variants.chromosome == row['Chr'],
                Variants.chromosome_position == row['Position'],
                Variants.variant_type == row['Type'],
                Variants.ref == row['Reference'],
                Variants.alt == row['Observed Allele']
            ).one_or_none()
        except MultipleResultsFound as e:
            current_app.logger.error(
                f'The following variant :\n{row}\n exists more than once in db!')
            continue

        # if variant exists in db
        if variant is not None:
            # populate the remaining fields
            vus_df.at[index, 'Exists in DB'] = True
            vus_df.at[index, 'Classification'] = str(variant.classification)
            # vus_df.at[index, ''] = variant.consequences TODO: add consequence to variant info

            existing_variant_ids.append(variant.variant_id)

            vus_df = get_external_references(variant.variant_id, index, vus_df)

    existing_vus_df = vus_df[vus_df['Exists in DB']]
    vus_df = vus_df[~vus_df['Exists in DB']]

    return existing_vus_df, vus_df, existing_variant_ids


def add_missing_columns(vus_df: pd.DataFrame) -> pd.DataFrame:
    # insert columns for clinvar clinical significance and error messages
    vus_df['Clinvar classification'] = ''
    vus_df['Clinvar classification last eval'] = ""
    vus_df['Clinvar classification review status'] = ""
    vus_df['Clinvar error msg'] = ""
    vus_df['Clinvar canonical spdi'] = ""
    vus_df['Clinvar uid'] = ""

    # insert columns for dbsnp and error messages
    vus_df['RSID'] = ""
    vus_df['RSID dbSNP verified'] = False
    vus_df['RSID dbSNP errorMsgs'] = ""

    # create new column to determine whether the variant has already been stored in the db or not
    vus_df.insert(0, 'Exists in DB', False)

    return vus_df


def preprocess_vus(vus_df: pd.DataFrame) -> InternalResponse:
    vus_df = filter_vus(vus_df)

    vus_df = add_missing_columns(vus_df)

    # check for existing variants
    existing_vus_df, vus_df, existing_variant_ids = check_for_existing_variants(vus_df)

    if len(vus_df) > 0:
        vus_df = get_gene_ids(vus_df)

        preprocess_and_get_rsids_res = get_rsids(vus_df)

        if preprocess_and_get_rsids_res.status != 200:
            current_app.logger.error(
                f'Preprocessing of VUS and retrieval of RSIDs failed 500')
            return InternalResponse({'areRsidsRetrieved:': False, 'isClinvarAccessed': False}, 500)
        else:
            vus_df = preprocess_and_get_rsids_res.data

            retrieve_clinvar_variant_classifications_res = retrieve_clinvar_variant_classifications(vus_df)

            if retrieve_clinvar_variant_classifications_res.status != 200:
                current_app.logger.error(
                    f'Retrieval of ClinVar variant classifications failed 500')
                return InternalResponse({'areRsidsRetrieved:': True, 'isClinvarAccessed': False}, 500)
            else:
                vus_df = retrieve_clinvar_variant_classifications_res.data

    return InternalResponse({'existing_vus_df': existing_vus_df, 'vus_df': vus_df,
                             'existing_variant_ids': existing_variant_ids}, 200)


def store_vus_df_in_db(vus_df: pd.DataFrame) -> List[int]:
    variant_ids = []

    # iterate through the dataframe
    for index, row in vus_df.iterrows():
        # create new variant
        new_variant = Variants(chromosome=row['Chr'], chromosome_position=row['Position'], variant_type=row['Type'],
                               ref=row['Reference'], alt=row['Observed Allele'], classification=row['Classification'],
                               gene_id=row['Gene Id'], gene_name=row['Gene'])
        # add the new variant to the session
        db.session.add(new_variant)

        db.session.flush()
        variant_ids.append(new_variant.variant_id)

        if len(row['RSID']) > 0 and row['RSID'] != 'NORSID':
            new_dbnsp_external_ref = ExternalReferences(variant_id=new_variant.variant_id,
                                                        db_type='db_snp',
                                                        error_msg=row['RSID dbSNP errorMsgs'])
            db.session.add(new_dbnsp_external_ref)

            db.session.flush()

            new_dbsnp = DbSnp(db_snp_id=row['RSID'],
                              external_references_id=new_dbnsp_external_ref.external_references_id)
            db.session.add(new_dbsnp)

        if len(row['Clinvar uid']) > 0:
            new_clinvar_external_ref = ExternalReferences(variant_id=new_variant.variant_id,
                                                          db_type='clinvar',
                                                          error_msg=row['Clinvar error msg'])
            db.session.add(new_clinvar_external_ref)

            db.session.flush()

            clinvar_last_evaluated = None
            if len(row['Clinvar classification last eval']):
                clinvar_last_evaluated = datetime.strptime(row['Clinvar classification last eval'], '%Y/%m/%d %H:%M')

            new_clinvar = Clinvar(clinvar_id=row['Clinvar uid'],
                                  external_references_id=new_clinvar_external_ref.external_references_id,
                                  canonical_spdi=row['Clinvar canonical spdi'],
                                  classification=row['Clinvar classification'],
                                  review_status=row['Clinvar classification review status'],
                                  last_evaluated=clinvar_last_evaluated)
            db.session.add(new_clinvar)

    return variant_ids


def create_file_and_sample_entries_in_db(vus_df: pd.DataFrame, file: FileStorage):
    # store the file in the db
    new_sample_file = SampleFiles(filename=file.filename, date_uploaded=datetime.now())
    db.session.add(new_sample_file)

    db.session.flush()

    unique_samples = []

    # iterate through the dataframe
    for index, row in vus_df.iterrows():
        # extract sample ids
        samples = str(row['Sample Ids']).replace(' ', '').split(',')
        unique_samples.extend(samples)

    # remove duplicate sample ids
    unique_samples = list(set(unique_samples))
    print(unique_samples)
    # store each unique sample in the db
    for sample in unique_samples:
        new_sample = Samples(sample_id=sample, sample_file_id=new_sample_file.sample_file_id, genome_version='GRCh37')
        db.session.add(new_sample)

    db.session.flush()


def store_variant_sample_relations_in_db(vus_df: pd.DataFrame, variant_ids: List[int]):
    # iterate through the dataframe
    for index, row in vus_df.iterrows():
        variant_id = variant_ids[int(index)]

        alt = row['Observed Allele']
        vus_genotype = row['Genotype']

        genotype_split = vus_genotype.split('/')

        genotype = Genotype.HETEROZYGOUS

        if genotype_split[0] == alt and genotype_split[1] == alt:
            genotype = Genotype.HOMOZYGOUS

        samples = str(row['Sample Ids']).replace(' ', '').split(',')

        for sample in samples:
            new_variants_samples = VariantsSamples(variant_id=variant_id, sample_id=sample, genotype=genotype)
            db.session.add(new_variants_samples)


def handle_vus_file(file: FileStorage) -> Response:
    vus_df = pd.read_excel(file, header=0)  # TODO: check re header
    current_app.logger.info(f'Number of VUS found in file: {len(vus_df)}')

    preprocess_vus_res = preprocess_vus(vus_df)

    if preprocess_vus_res.status != 200:
        response = preprocess_vus_res.data
        response['isSuccess'] = False
        return Response(json.dumps(response), 200)
    else:
        existing_vus_df = preprocess_vus_res.data['existing_vus_df']
        existing_variant_ids = preprocess_vus_res.data['existing_variant_ids']

        vus_df = preprocess_vus_res.data['vus_df']

        # join existing vus_df with the new vus
        all_vus_df = pd.concat([existing_vus_df, vus_df], axis=0)

        # store file and samples entries
        create_file_and_sample_entries_in_db(all_vus_df, file)

        # store those vus that do not already exist in the db
        variant_ids = store_vus_df_in_db(vus_df)

        # join existing vus_df's variant ids with the new vus variant ids
        all_variant_ids = existing_variant_ids + variant_ids

        # store variants-samples entries in db
        store_variant_sample_relations_in_db(all_vus_df, all_variant_ids)

        try:
            # Commit the session to persist changes to the database
            db.session.commit()
        except SQLAlchemyError as e:
            # Changes were rolled back due to an error
            db.session.rollback()

            current_app.logger.error(
                f'Rollback carried out since insertion of entries in DB failed due to error: {e}')

            response = {'isSuccess': False, 'areRsidsRetrieved:': True, 'isClinvarAccessed': True}
            return Response(json.dumps(response), 200)

        # update column names to camelCase format
        new_vus_df = prep_vus_df_for_react(all_vus_df)

        # convert df to list
        vus_list = convert_df_to_list(new_vus_df)

        return Response(
            json.dumps({'isSuccess': True, 'areRsidsRetrieved:': True, 'isClinvarAccessed': True,
                        'vusList': vus_list}), 200)
