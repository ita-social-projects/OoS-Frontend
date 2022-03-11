export interface ProviderAdminTable {
  pib: string,
  email: string,
  phoneNumber: string,
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
  providerId?: string;
  isDeputy: string;
  managedWorkshopIds?: string[];

  constructor(info, isDeputy, providerId?, workshopIds?: string[]) {
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