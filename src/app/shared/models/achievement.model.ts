import { Child } from './child.model';
import { PaginationParameters } from './queryParameters.model';
import { Teacher } from './teacher.model';

export class Achievement {
  id: string;
  title: string;
  achievementDate: string;
  workshopId: string;
  achievementTypeId: number;
  childrenIDs: string[];
  teachers: string[];
  children: Child[];

  constructor(info, workshopId, achievement: Achievement) {
    this.title = info.title;
    this.achievementDate = info.achievementDate;
    this.workshopId = workshopId;
    this.achievementTypeId = info.achievementTypeId;
    this.childrenIDs = info.children.map((child: Child) => child.id);
    if (!info.teachers) {
      this.teachers = achievement.teachers.map((teacher) => (teacher as unknown as AchievmentTeacherValue).title);
    } else {
      this.teachers = info.teachers.map((teacher: Teacher) => `${teacher.lastName} ${teacher.firstName}`);
    }
    if (achievement) {
      this.id = achievement.id;
    }
  }
}

export interface AchievementType {
  id: number;
  title: string;
}

export interface AchievmentTeacherValue {
  title: string;
  id: string;
  achievementId: string;
}

export interface AchievementParameters extends PaginationParameters {
  workshopId: string;
}
