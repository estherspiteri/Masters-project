import json

from flask import Blueprint, Response, request
from server.services.review_service import load_review_page_content, save_review, get_all_reviews

review_views = Blueprint('review_views', __name__)


@review_views.route('/load/<string:vus_id>', methods=['GET'])
def load_review_page(vus_id: str):
    variant_summary, publications, acmg_rules, classifications = load_review_page_content(vus_id)

    return Response(json.dumps({"variantSummary": variant_summary, "publications": publications,
                                "acmgRules": acmg_rules, "classifications": classifications}),
                    200, mimetype='application/json')


@review_views.route('/save/<string:vus_id>', methods=['POST'])
def save_classification_review(vus_id: str):
    new_classification = request.form['newClassification']
    reason = request.form['reason']
    publication_ids = request.form['publicationIds']
    acmg_rule_ids = request.form['acmgRuleIds']
    is_new_acmg_rule_added = request.form['isNewAcmgAdded'] == 'true'
    is_existing_acmg_removed = request.form['isExistingAcmgRemoved'] == 'true'

    # Parse the JSON string into a Python object
    if publication_ids:
        publication_ids_list = json.loads(publication_ids)
    else:
        publication_ids_list = []

    # Parse the JSON string into a Python object
    if acmg_rule_ids:
        acmg_rule_ids_list = json.loads(acmg_rule_ids)
    else:
        acmg_rule_ids_list = []

    res = save_review(vus_id, new_classification, reason, publication_ids_list, acmg_rule_ids_list, is_new_acmg_rule_added, is_existing_acmg_removed)

    return Response(json.dumps({"isSuccess": res.status == 200}), res.status, mimetype='application/json')


@review_views.route('/view/<string:vus_id>', methods=['GET'])
def get_variant_classification_reviews(vus_id: str):
    classification_reviews, variant_summary = get_all_reviews(vus_id)

    return Response(json.dumps({"variantSummary": variant_summary, "reviews": classification_reviews, "isSuccess": True
                                }), 200, mimetype='application/json')
