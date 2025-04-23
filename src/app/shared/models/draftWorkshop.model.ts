import { DateTimeRanges } from 'shared/models/working-hours.model';
import { Contacts, Workshop, WorkshopDescriptionItem } from 'shared/models/workshop.model';
import { FormOfLearning, PayRateType } from 'shared/enum/workshop';

export enum WorkshopType {
  WithMainProperties = 'withMainProperties',
  WithOtherRequiredProperties = 'withOtherRequiredProperties',
  WithDescription = 'withDescription',
  WithContacts = 'withContacts'
}

export abstract class BaseWorkshop {
  abstract $type?: WorkshopType;
}

export class WorkshopMainRequiredProperties extends BaseWorkshop {
  $type?: WorkshopType = WorkshopType.WithMainProperties;
  title: string;
  shortTitle: string;
  minAge: number;
  maxAge: number;
  dateTimeRanges: DateTimeRanges[];
  startDate: string;
  endDate: string;
  formOfLearning: FormOfLearning;
  availableSeats: number;
  competitiveSelection: boolean;
  competitiveSelectionDescription?: string;
  providerId?: string;
}

export class WorkshopOtherRequiredProperties extends WorkshopMainRequiredProperties {
  $type?: WorkshopType = WorkshopType.WithOtherRequiredProperties;
  isSelfFinanced: boolean;
  specialNeedsType: string;
  isInclusive: boolean;
  educationalShift: string;
  ageComposition: string;
  groupType: string;
  areThereBenefits: boolean;
  preferentialTermsOfParticipation: string;
  isPaid?: boolean;
  price: number;
  payRate: PayRateType;
}

export class WorkshopDescription extends WorkshopOtherRequiredProperties {
  $type?: WorkshopType = WorkshopType.WithDescription;
  workshopDescriptionItems: WorkshopDescriptionItem[];
  withDisabilityOptions: boolean;
  disabilityOptionsDesc: string;
  institutionId: string;
  institutionHierarchyId: string;
  directionIds: number[];
  keywords: string[];
  additionalDescription: string;
  coverageId: number;
  tagIds: number[];
}

export class WorkshopContacts extends WorkshopDescription {
  $type?: WorkshopType = WorkshopType.WithContacts;
  contacts: Contacts[];
}

export interface WorkshopDraftState {
  step1?: WorkshopMainRequiredProperties;
  step2?: WorkshopOtherRequiredProperties;
  step3?: WorkshopDescription;
  step4?: WorkshopContacts;
  workshopForLoading?: Workshop;
}
