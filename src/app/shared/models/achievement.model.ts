import { Child } from "./child.model";

export class Achievement {
  id?: string;
  title: string;
  achievementDate: string;
  workshopId: string;
  achievementTypeId: number;
  childrenIDs?: string[];
  teachers?: string[];
  children?: Child[];

  constructor(info, workshopId, childrenIDs, teachers) {
    this.title = info.title,
    this.achievementDate = info.achievementDate,
    this.workshopId = workshopId;
    this.achievementTypeId = info.achievementTypeId,
    this.childrenIDs = childrenIDs,
    this.teachers = teachers;
  }

}
