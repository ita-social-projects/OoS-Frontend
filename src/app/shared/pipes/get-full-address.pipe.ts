import { Pipe, PipeTransform } from '@angular/core';
import { Address } from '../models/address.model';

@Pipe({
  name: 'getFullAddress'
})
export class GetFullAddressPipe implements PipeTransform {
  transform(address: Address): string {
    return address ? `${address.codeficatorAddressDto.settlement}, ${address.street}, ${address.buildingNumber}` : '';
  }
}
