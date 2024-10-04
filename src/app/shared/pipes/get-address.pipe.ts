import { Pipe, PipeTransform } from '@angular/core';
import { ModeConstants } from '../constants/constants';
import { Address } from '../models/address.model';

@Pipe({
  name: 'getAddress'
})
export class GetAddressPipe implements PipeTransform {
  public transform(address: Address, mode: string): string {
    if (!address) {
      return '';
    }

    switch (mode) {
      case ModeConstants.SHORT:
        return `${address.street}, ${address.buildingNumber}`;
      case ModeConstants.FULL:
        return `${address.codeficatorAddressDto.settlement}, ${address.street}, ${address.buildingNumber}`;
      default:
        return '';
    }
  }
}
