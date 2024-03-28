import { useLocation } from "react-router-dom";
import PublicationViewPage from "../components/publication-view-page/publication-view-page";
import { publicationService } from "../services/publication/publication.service";
import Loader from "../atoms/loader/loader";
import React, { useEffect, useState } from "react";
import { IPublicationPreview } from "../models/publication-view.model";
import { IVUSSummary } from "../models/vus-summary.model";
import { convertPubDates } from "../helpers/pub-date-convertors";

const PublicationViewPageWrapper: React.FunctionComponent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [publications, setPublications] =
    useState<IPublicationPreview[]>(undefined);
  const [variant, setVariant] = useState<IVUSSummary>(undefined);

  const loc = useLocation();
  const variantId = loc.pathname.split("/publication-view/")[1];

  useEffect(() => {
    if (isLoading) {
      publicationService
        ?.getPublicationsByVariantId({ variantId: variantId })
        .then((res) => {
          if (res.isSuccess) {
            setPublications(convertPubDates(res.publications));
            setVariant(res.variant);
            setIsLoading(false);
          } else {
            //TODO: handle error
          }
        });
    }
  }, [isLoading, variantId]);

  if (isLoading) {
    return <Loader />;
  } else {
    return (
      <PublicationViewPage
        description={`<p>Below you can find the publications for VUS with <b>Id ${variantId}</b>.</p><p>Click on a publication title to view a summary of the respective publication. You can view the publications in a new window by clicking on the button found on the right-side of each title.</p>`}
        variantId={variantId}
        publications={publications}
        variant={variant}
      />
    );
  }
};

export default PublicationViewPageWrapper;
