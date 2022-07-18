import { Person } from "./user.model";
export interface ProviderAdminTable {
  id: string,
  pib: string,
  email: string,
  phoneNumber: string,
  isDeputy: boolean,
  status: string,
  role?: string,
}
export class ProviderAdmin implements Person {
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
  accountStatus?: string;

  constructor(info, isDeputy, providerId?, workshopIds?: string[], accountStatus?) {
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
    this.accountStatus = accountStatus;
  }
}
