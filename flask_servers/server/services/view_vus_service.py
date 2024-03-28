from datetime import datetime
from typing import List, Dict

import pandas as pd

from server import db
from server.helpers.data_helper import convert_df_to_list
from server.models import ExternalReferences, Variants, DbSnp, Clinvar, VariantsSamples, Genotype


def retrieve_all_vus_summaries_from_db():
    variants: List[Variants] = db.session.query(Variants).all()

    variants_data = [{'id': v.id, 'chromosome': v.chromosome,
                      'chromosomePosition': v.chromosome_position, 'gene': v.gene_name,
                      'refAllele': v.ref, 'altAllele': v.alt} for v in variants]

    # store the variants into a dataframe
    vus_df = pd.DataFrame(variants_data)

    # insert columns for dbsnp
    vus_df['rsid'] = ""
    vus_df['rsidDbsnpVerified'] = False

    vus_df_copy = vus_df.copy()

    # iterate through the dataframe
    for index, row in vus_df_copy.iterrows():
        # retrieve all external references related to that variant
        external_references: List[ExternalReferences] = db.session.query(ExternalReferences).filter(
            ExternalReferences.variant_id == row['id']
        ).all()

        for ref in external_references:
            if ref.db_type == 'db_snp':
                # retrieve dbsnp entry related to the variant
                dbsnp: DbSnp = db.session.query(DbSnp).filter(
                    DbSnp.external_db_snp_id == ref.id
                ).one_or_none()

                vus_df.at[index, 'rsid'] = dbsnp.id
                vus_df.at[index, 'rsidDbsnpVerified'] = len(ref.error_msg) == 0

    var_list = convert_df_to_list(vus_df)

    return var_list


def retrieve_vus_from_db(vus_id: int) -> Dict:
    variant: Variants = db.session.query(Variants).filter(Variants.id == vus_id).first()

    variant_data = {'id': variant.id, 'chromosome': variant.chromosome,
                    'chromosomePosition': variant.chromosome_position, 'gene': variant.gene_name,
                    'type': variant.variant_type.value, 'refAllele': variant.ref, 'altAllele': variant.alt,
                    'classification': variant.classification.value}

    # retrieve all external references related to that variant
    external_references: List[ExternalReferences] = db.session.query(ExternalReferences).filter(
        ExternalReferences.variant_id == variant.id
    ).all()

    for ref in external_references:
        if ref.db_type == 'db_snp':
            # retrieve dbsnp entry related to the variant
            dbsnp: DbSnp = db.session.query(DbSnp).filter(
                DbSnp.external_db_snp_id == ref.id
            ).one_or_none()

            variant_data['rsid'] = dbsnp.id
            variant_data['rsidDbsnpVerified'] = len(ref.error_msg) == 0
            variant_data['rsidDbsnpErrorMsgs'] = ref.error_msg

        elif ref.db_type == 'clinvar':
            # retrieve clinvar entry related to the variant
            clinvar: Clinvar = db.session.query(Clinvar).filter(
                Clinvar.external_clinvar_id == ref.id
            ).one_or_none()

            if clinvar.last_evaluated is not None:
                clinvar_last_evaluated = datetime.strftime(clinvar.last_evaluated, '%Y/%m/%d %H:%M')
            else:
                clinvar_last_evaluated = None

            # populate the clinvar fields
            variant_data['clinvarUid'] = clinvar.id
            variant_data['clinvarCanonicalSpdi'] = clinvar.canonical_spdi
            variant_data['clinvarClassification'] = clinvar.classification
            variant_data['clinvarClassificationReviewStatus'] = clinvar.review_status
            variant_data['clinvarClassificationLastEval'] = clinvar_last_evaluated
            variant_data['clinvarErrorMsg'] = ref.error_msg

    # retrieve all samples related to that variant
    variant_samples: List[VariantsSamples] = (db.session.query(VariantsSamples)
                                              .filter(VariantsSamples.variant_id == variant.id)).all()

    num_heterozygous = len([s for s in variant_samples if s.genotype == Genotype.HETEROZYGOUS])
    num_homozygous = len(variant_samples) - num_heterozygous

    variant_data['numHeterozygous'] = num_heterozygous
    variant_data['numHomozygous'] = num_homozygous

    return variant_data
