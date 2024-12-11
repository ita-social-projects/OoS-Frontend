import { WorkshopType } from './DraftDTO';
import { WorkshopDescriptionItemDto } from './WorkshopDescriptionItemDto';
import { WorkshopOtherRequiredPropertiesDto } from './WorkshopOtherRequiredPropertiesDto';

export class WorkshopDescriptionDto extends WorkshopOtherRequiredPropertiesDto {
  type: WorkshopType = 'withDescription';
  workshopDescriptionItems?: WorkshopDescriptionItemDto[];
  withDisabilityOptions?: boolean;
  disabilityOptionsDesc?: string;
  institutionId?: string;
  institutionHierarchyId?: string;
  directionIds?: number[];
  keywords?: string[];
  additionalDescription?: string;
  areThereBenefits?: boolean;
  preferentialTermsOfParticipation?: string;
  coverageId?: number;
  tagIds?: number[];
}
