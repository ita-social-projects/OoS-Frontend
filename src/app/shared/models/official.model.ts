import { Person } from './user.model';

export class Official implements Person {
  id?: string;
  userId?: string;
  position: string;
  positionId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  rnokpp: string;
  dismissalOrder: string;
  recruitmentOrder: string;
  dismissalReason: string;
  employmentType: string;
  activeFrom: string;
  activeTo: string;
}
