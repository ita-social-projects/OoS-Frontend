import { AddressDto } from './AddressDto';
import { WorkshopType } from './DraftDTO';
import { WorkshopDescriptionDto } from './WorkshopDescriptionDto';

export class WorkshopContactsDto extends WorkshopDescriptionDto {
  type: WorkshopType = 'withContacts';
  website?: string;
  facebook?: string;
  instagram?: string;
  addressId: number;
  address: AddressDto;
}
