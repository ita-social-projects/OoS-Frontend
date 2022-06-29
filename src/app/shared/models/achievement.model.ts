
export class Achievement {
  id?: string;
  title: string;
  achievementDate: string;
  workshopId: string;
  achievementTypeId: number;
  childrenIDs?: string[];
  teachers?: string[];

  constructor(info, workshopId) {
    this.title = info.title,
    this.achievementDate = info.achievementDate,
    this.workshopId = workshopId;
    this.achievementTypeId = info.achievementTypeId,
    this.childrenIDs = info.childrenIDs,
    this.teachers = info.teachers;
  }
}
