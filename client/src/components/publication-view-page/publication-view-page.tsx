import React from "react";
import styles from "./publication-view-page.module.scss";
import PublicationPreview from "./publication-preview/publication-preview";
import { IPublicationPreview } from "../../models/publication-view.model";
import VariantSummary from "../shared/variant-summary/variant-summary";
import { IVUSSummary } from "../../models/vus-summary.model";

type PublicationViewPageProps = {
  variantId: string;
  variant: IVUSSummary;
  publications?: IPublicationPreview[];
};

const PublicationViewPage: React.FunctionComponent<PublicationViewPageProps> = (
  props: PublicationViewPageProps
) => {
  return (
    <div className={styles["publication-view-container"]}>
      <div className={styles["title-container"]}>
        <div className={styles.title}>Publications</div>
        <div className={styles.description}>
          <p>
            Below you can find the publications for VUS with Id&nbsp;
            {props.variantId}.
          </p>
          <p>
            Click on a title to view a summary of the respective publication.
            You can view the publications in a new window by clicking on the
            button found on the right-side of each title.
          </p>
        </div>
      </div>

      {props.publications && (
        <>
          {props.publications && (
            <div className={styles["publications-previews-container"]}>
              <span className={styles.status}>
                <span className={styles.colour}>
                  {props.publications.length}
                </span>
                &nbsp;
                {props.publications.length === 1
                  ? "publication"
                  : "publications"}
                &nbsp;found for the below variant
              </span>
              <div className={styles["variant-summary"]}>
                <VariantSummary variant={props.variant} />
              </div>
              <div className={styles["publication-previews"]}>
                <div className={styles.header}>
                  <span>Title</span>
                </div>

                <div className={styles["publication-preview-contents"]}>
                  {props.publications.map((publication) => (
                    <PublicationPreview data={publication} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PublicationViewPage;
