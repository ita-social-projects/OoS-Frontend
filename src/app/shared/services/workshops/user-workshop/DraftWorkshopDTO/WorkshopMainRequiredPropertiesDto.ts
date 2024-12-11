import { BaseWorkshopDto } from './BaseWorkshopDto';
import { DateTimeRangeDto } from './DateTimeRangeDto';
import { WorkshopType } from './DraftDTO';

export class WorkshopMainRequiredPropertiesDto extends BaseWorkshopDto {
  type: WorkshopType = 'withMainProperties';
  id?: string;
  title: string;
  shortTitle: string;
  phone: string;
  email: string;
  minAge: number;
  maxAge: number;
  dateTimeRanges?: DateTimeRangeDto[];
  formOfLearning: number;
  isPaid: boolean;
  price?: number;
  payRate?: number;
  availableSeats: number;
  competitiveSelection: boolean;
  competitiveSelectionDescription?: string;
  providerId: string;
}
