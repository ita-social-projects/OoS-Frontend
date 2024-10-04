import { Person } from './user.model';

export class Judge implements Person {
  id?: string;
  competitionId?: string;
  firstName: string;
  lastName: string;
  judgeInfo?: string;

  constructor(info: Partial<Judge>) {
    this.firstName = info.firstName;
    this.lastName = info.lastName;
    this.judgeInfo = info.judgeInfo;
    if (info.id) {
      this.id = info.id;
    }
  }
}
