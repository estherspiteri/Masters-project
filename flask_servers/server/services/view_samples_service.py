from typing import List, Dict

import pandas as pd

from server import db
from server.models import Samples, SampleFiles, VariantsSamples, t_samples_phenotypes, Phenotypes, \
    VariantsSamplesAcmgRules


def get_sample_info_from_db(sample: Samples) -> Dict:
    sample_file: SampleFiles = (
        db.session.query(SampleFiles).filter(SampleFiles.id == sample.sample_file_id)
        .one_or_none())

    # Query with filter condition on sample_id
    phenotype_ontology_term_ids_res: List[str] = (db.session.query(t_samples_phenotypes.c.ontology_term_id)
                                                  .filter(t_samples_phenotypes.c.sample_id == sample.id).all())

    phenotype_ontology_term_ids = [x[0] for x in phenotype_ontology_term_ids_res]

    sample_phenotypes: List[Phenotypes] = (db.session.query(Phenotypes)
                                           .filter(Phenotypes.ontology_term_id.in_(phenotype_ontology_term_ids)).all())

    phenotypes = []

    for p in sample_phenotypes:
        sample_phenotype = {'ontologyId': p.ontology_term_id, 'name': p.term_name}
        phenotypes.append(sample_phenotype)

    variants_samples: List[VariantsSamples] = db.session.query(VariantsSamples).filter(
        VariantsSamples.sample_id == sample.id).all()

    variants = []

    for v in variants_samples:
        samples_variants_acmg_rules: List[VariantsSamplesAcmgRules] = db.session.query(VariantsSamplesAcmgRules).filter(VariantsSamplesAcmgRules.sample_id == sample.id,
                                                                                                                        VariantsSamplesAcmgRules.variant_id == v.variant_id).all()

        acmg_rule_names = [r.rule_name.value for r in samples_variants_acmg_rules]

        variant_sample = {'variantId': v.variant_id, 'genotype': v.genotype.value, 'acmgRuleNames': acmg_rule_names}
        variants.append(variant_sample)

    return {'sampleId': sample.id, 'phenotype': phenotypes,
                        'genomeVersion': sample.genome_version, 'fileUploadName': sample_file.filename,
                        'dateOfFileUpload': str(sample_file.date_uploaded.date()), 'variants': variants}


def retrieve_all_samples_from_db():
    samples_arr = []

    # retrieve all samples
    all_samples = db.session.query(Samples).all()

    # for each sample retrieve the file information and the variants it has
    for sample in all_samples:
        sample_file: SampleFiles = (
            db.session.query(SampleFiles).filter(SampleFiles.id == sample.sample_file_id)
            .one_or_none())

        variants_count: List[VariantsSamples] = db.session.query(VariantsSamples).filter(
            VariantsSamples.sample_id == sample.id).count()

        samples_arr.append({'sampleId': sample.id, 'dateOfFileUpload': str(sample_file.date_uploaded.date()), 'numOfVariants': variants_count})

    return samples_arr


def retrieve_sample_from_db(sample_id: str):
    # retrieve sample
    sample = db.session.query(Samples).filter(Samples.id == sample_id).first()
    sample_dict = get_sample_info_from_db(sample)

    return sample_dict
