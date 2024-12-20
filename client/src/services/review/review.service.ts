import customFetch from "../api/api.service";
import {
  IGetAllClassificationReviewsRequest,
  IGetAllClassificationReviewsResponse,
  ILoadReviewPageRequest,
  ILoadReviewPageResponse,
  ISaveClassificationReviewRequest,
  ISaveClassificationReviewResponse,
} from "./review.dto";

export class ReviewService {
  async loadReviewPage(
    input: ILoadReviewPageRequest
  ): Promise<ILoadReviewPageResponse> {
    const result: ILoadReviewPageResponse = await customFetch(
      `/review/load/${input.vusId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
      }
    )
      .then((response) => {
        return response;
      })
      .catch((error) => console.error("error============:", error)); 

    return result;
  }

  async saveClassificationReview(
    input: ISaveClassificationReviewRequest
  ): Promise<ISaveClassificationReviewResponse> {
    let data = new FormData();

    // Append the JSON string as a blob to the FormData
    data.append("newClassification", input.newClassification);
    data.append("reason", input.reason);

    const publicationIdsJsonData = input.publicationIds
      ? JSON.stringify(input.publicationIds)
      : "";

    data.append("publicationIds", publicationIdsJsonData);

    const acmgRuleIdsJsonData = input.acmgRuleIds
      ? JSON.stringify(input.acmgRuleIds)
      : "";

    data.append("acmgRuleIds", acmgRuleIdsJsonData);

    data.append("isNewAcmgAdded", input.isNewAcmgAdded.toString());

    data.append(
      "isExistingAcmgRemoved",
      input.isExistingAcmgRemoved.toString()
    );

    const result: ISaveClassificationReviewResponse = await customFetch(
      `/review/save/${input.vusId}`,
      {
        method: "POST",
        body: data,
      }
    )
      .then((response) => {
        return response;
      })
      .catch((error) => console.error("error============:", error)); 

    return result;
  }

  async getAllClassificationReviews(
    input: IGetAllClassificationReviewsRequest
  ): Promise<IGetAllClassificationReviewsResponse> {
    const result: IGetAllClassificationReviewsResponse = await customFetch(
      `/review/view/${input.vusId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
        },
      }
    )
      .then((response) => {
        return response;
      })
      .catch((error) => console.error("error============:", error)); 

    return result;
  }
}

export const reviewService = new ReviewService();
