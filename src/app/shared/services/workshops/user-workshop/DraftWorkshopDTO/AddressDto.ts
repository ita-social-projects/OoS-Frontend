import { AllAddressPartsDto } from './AllAddressPartsDto';

export interface AddressDto {
  id: number;
  street: string;
  buildingNumber: string;
  latitude?: number;
  longitude?: number;
  catottgId: number;
  codeficatorAddressDto?: AllAddressPartsDto;
}
