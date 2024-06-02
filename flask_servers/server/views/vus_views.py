from datetime import datetime
from typing import List

import pandas as pd
from flask import Blueprint, Response, current_app, request
import json

from server import db
from server.models import GeneAttributes, Clinvar, AutoClinvarEvalDates, AutoClinvarUpdates
from server.services.acmg_service import get_acmg_rules, add_acmg_rule_to_variant, remove_acmg_rule_from_variant
from server.services.view_vus_service import retrieve_all_vus_summaries_from_db, \
    retrieve_vus_from_db
from server.services.vus_preprocess_service import handle_vus_file, preprocess_vus, handle_vus_from_form

vus_views = Blueprint('vus_views', __name__)


@vus_views.route('/upload', methods=['POST'])
def store_vus():
    current_app.logger.info(f"User storing new VUS")

    vus = request.form['vus']

    # Parse the JSON string into a Python object
    if vus:
        vus_object = json.loads(vus)
        vus_object['samples'] = ','.join([str(elem) for elem in vus_object['samples']])
    else:
        vus_object = {}

    # Convert dictionary values into arrays containing the string value
    vus_dict = {key: [value] for key, value in vus_object.items()}

    vus_df = pd.DataFrame.from_dict(vus_dict)

    return handle_vus_from_form(vus_df)


@vus_views.route('/file', methods=['POST'])
def store_and_verify_vus_file():
    current_app.logger.info(f"User storing new VUS file")

    file = request.files['file']
    current_app.logger.info(f'Received file {file.filename} of type {file.content_type}')

    multiple_genes_selection = request.form['multipleGenesSelection']

    # Parse the JSON string into a Python object
    if multiple_genes_selection:
        multiple_genes_selection_object = json.loads(multiple_genes_selection)
    else:
        multiple_genes_selection_object = []

    return handle_vus_file(file, multiple_genes_selection_object)


@vus_views.route('/view', methods=['GET'])
def view_all_vus():
    current_app.logger.info(f"User requested to view all VUS")

    var_list = retrieve_all_vus_summaries_from_db()

    return Response(json.dumps({'isSuccess': True, 'vusList': var_list}), 200, mimetype='application/json')


@vus_views.route('/view/<string:vus_id>', methods=['GET'])
def get_vus(vus_id: int):
    current_app.logger.info(f"User requested to view vus with id {vus_id}")

    var_list = retrieve_vus_from_db(vus_id)

    acmg_rules = get_acmg_rules()

    return Response(json.dumps({'isSuccess': True, 'vus': var_list, 'acmgRules': acmg_rules}), 200,
                    mimetype='application/json')


@vus_views.route('/gene/<string:gene_name>', methods=['GET'])
def verify_gene(gene_name: str):
    current_app.logger.info(f"User requested to verify gene {gene_name}")

    # Retrieving gene that matches gene_name from Gene Attributes table
    gene_attribute: GeneAttributes = db.session.query(GeneAttributes).filter(GeneAttributes.attribute_name == 'gene_name', GeneAttributes.attribute_value == gene_name.upper()).one_or_none()

    gene_id = None
    if gene_attribute is not None:
        gene_id = gene_attribute.gene_id

    return Response(json.dumps({'isSuccess': gene_id is not None, 'geneId': gene_id}), 200, mimetype='application/json')


@vus_views.route('/all-acmg-rules', methods=['GET'])
def get_all_acmg_rules():
    current_app.logger.info(f"User requested all acmg rules ")

    acmg_rules = get_acmg_rules()

    return Response(json.dumps({'isSuccess': True, 'acmgRules': acmg_rules}), 200, mimetype='application/json')


@vus_views.route('/get_clinvar_updates/<string:clinvar_id>', methods=['GET'])
def get_clinvar_updates(clinvar_id: str):
    current_app.logger.info(f"User requested all clinvar updates for Clinvar id {clinvar_id} ")

    clinvar_updates_list = []

    clinvar: Clinvar = db.session.get(Clinvar, int(clinvar_id))

    eval_dates: List[AutoClinvarEvalDates] = clinvar.auto_clinvar_eval_dates

    # reversed to get dates in desc order
    eval_dates.reverse()

    for eval_date in eval_dates:
        update = None
        if eval_date.auto_clinvar_update_id is not None:
            auto_clinvar_update: AutoClinvarUpdates = eval_date.auto_clinvar_update
            update = {'classification': auto_clinvar_update.classification, 'reviewStatus': auto_clinvar_update.review_status, 'lastEval': datetime.strftime(auto_clinvar_update.last_evaluated, '%Y/%m/%d %H:%M')}

        clinvar_updates_list.append({'dateChecked': datetime.strftime(eval_date.eval_date, '%Y/%m/%d %H:%M'), 'update': update})

    return Response(json.dumps({'isSuccess': True, 'clinvarUpdates': clinvar_updates_list}), 200, mimetype='application/json')
