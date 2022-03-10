
export interface ProviderAdminBackend {
  firstName: string,
  lastName: string,
  middleName: string,
  email: string,
  phone: string,
  isDeputy: boolean,
}

export interface ProviderAdminTable {
  pib: string,
  email: string,
  phone: string,
  deputy: string,
}

export class ProviderAdmin {
  id?: string;
  userId?: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  providerId: string;
  isDeputy: string;
  managedWorkshopIds?: Array<string>;

  constructor(info, providerId, isDeputy, workshopIds?: Array<string>) {
    this.email = info.email;
    this.phoneNumber = info.phoneNumber;
    this.firstName = info.firstName;
    this.middleName = info.middleName;
    this.lastName = info.lastName;
    this.providerId = providerId;
    this.isDeputy = isDeputy;
    if (workshopIds?.length) {
      this.managedWorkshopIds = workshopIds;
    }
  }
}