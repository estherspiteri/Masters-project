import { IHPOTerm } from "../services/sample/sample.dto";
import { IVUSSummary } from "./vus-summary.model";

export enum Genotype {
  Homozygous = "HOMOZYGOUS",
  Heterozygous = "HETEROZYGOUS",
}

export interface ISampleVariant {
  variantId: number;
  variant: IVUSSummary;
  genotype: Genotype;
  hgvs: string;
  isHgvsUpdated: boolean;
}

export interface INotSampleVariant {
  variantId: number;
  variant: IVUSSummary;
}

export interface IFile {
  filename: string;
  dateOfFileUpload: Date;
}

export interface ISample {
  sampleId: string;
  genomeVersion: string;
  variants: ISampleVariant[];
  notSampleVariants: INotSampleVariant[];
  phenotype?: IHPOTerm[] | null;
}

export interface ISampleSummary {
  sampleId: string;
  numOfVariants: number;
}
