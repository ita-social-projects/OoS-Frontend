
export class Achievement {
  id?: string;
  title: string;
  achievementDate: string;
  workshopId: string;
  achievementTypeId: number;
  childrenIDs?: string;
  teachers?: string;

  constructor(title?, childrenIDs?, teacher?) {
    this.childrenIDs = childrenIDs,
    this.teachers = teacher;
    this.title = title;
  }
}
