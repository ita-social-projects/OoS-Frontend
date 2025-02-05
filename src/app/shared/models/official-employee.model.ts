import { Person } from './user.model';

export class OfficialEmployee implements Person {
  id?: string;
  userId?: string;
  position: string;
  positionId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  rnokpp: string;
  // TODO: add this functionality when avaliable on backend
  dismissalOrder: string;
  recruitmentOrder: string;
  dismissalReason: string;
  employmentType: string;
  //
  activeFrom: string;
  activeTo: string;
}
