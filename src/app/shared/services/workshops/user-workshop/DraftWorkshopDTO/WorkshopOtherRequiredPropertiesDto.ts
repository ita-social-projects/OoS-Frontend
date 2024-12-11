import { WorkshopType } from './DraftDTO';
import { WorkshopMainRequiredPropertiesDto } from './WorkshopMainRequiredPropertiesDto';

export class WorkshopOtherRequiredPropertiesDto extends WorkshopMainRequiredPropertiesDto {
  type: WorkshopType = 'withOtherRequiredProperties';
  shortStay: boolean;
  isSelfFinanced: boolean;
  isSpecial: boolean;
  specialNeedsId?: number;
  isInclusive: boolean;
  educationalShiftId: number;
  languageOfEducationId: number;
  typeOfAgeCompositionId: number;
  educationalDisciplines: string;
  categoryId: number;
  gropeTypeId: number;
  memberOfWorkshopId?: string;
}
