import { Codeficator } from './codeficator.model';

export interface Contact {
  address: ContactAddress;
  emails: ContactEmails[];
  isDefault: boolean;
  phones: ContactPhones[];
  socialNetworks: ContactSocials[];
  title: string;
}

export interface ContactAddress {
  street: string;
  buildingNumber: string;
  catottgId: number;
  latitude: number;
  longitude: number;
  codeficatorAddressDto: Codeficator;
}

export interface ContactEmails {
  type: string;
  address: string;
}

export interface ContactPhones {
  type: string;
  number: string;
}

export interface ContactSocials {
  type: string;
  url: string;
}
