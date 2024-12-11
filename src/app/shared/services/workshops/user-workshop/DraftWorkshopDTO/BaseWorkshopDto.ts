import { WorkshopType } from './DraftDTO';

export abstract class BaseWorkshopDto {
  public abstract type: WorkshopType;
}
