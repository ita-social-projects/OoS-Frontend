import { Person } from './user.model';

export class Parent {
  id?: string;
  userId?: number;

  constructor(info: Partial<Parent>) {
    this.id = info.id;
    this.userId = info.userId;
  }
}

export class ParentWithContactInfo implements Person {
  id: string;
  userId?: string;
  email?: string;
  phoneNumber?: string;
  lastName: string;
  middleName?: string;
  firstName: string;
  emailConfirmed?: boolean;
  gender?: string;
  isBlocked: boolean;

  constructor(info: Partial<ParentWithContactInfo>) {
    this.id = info.id;
    this.userId = info.userId;
    this.email = info.email;
    this.phoneNumber = info.phoneNumber;
    this.lastName = info.lastName;
    this.middleName = info.middleName;
    this.firstName = info.firstName;
  }
}

export interface ParentBlockedData {
  parentId: string;
  isBlocked: boolean;
  reason?: string;
}

export interface ParentPayload {
  phoneNumber: string;
  gender: string;
  dateOfBirth: string;
}
