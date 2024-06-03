import { IPhenotype } from "./phenotype.model";

export interface IVusSample {
  id: string;
  hgvs: string;
}

export interface IVus {
  id: number;
  chromosome: string;
  chromosomePosition: number;
  classification: string;
  clinvarClassification?: string;
  clinvarClassificationLastEval?: string;
  clinvarClassificationReviewStatus?: string;
  clinvarCanonicalSpdi?: string;
  clinvarId?: number;
  clinvarVariationId?: string;
  clinvarErrorMsg?: string;
  gene: string;
  altAllele: string;
  refAllele: string;
  rsid?: string;
  rsidDbsnpVerified: boolean;
  rsidDbsnpErrorMsgs: string;
  type: string; //TODO: change to enum?
  numHeterozygous?: number;
  numHomozygous?: number;
  samples: IVusSample[];
  phenotypes: IPhenotype[];
  acmgRuleIds: number[];
  numOfPublications: number;
}
