import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Achievement, AchievementType } from '../../../../../shared/models/achievement.model';
import { Person } from '../../../../../shared/models/user.model';
import { Workshop } from '../../../../../shared/models/workshop.model';
import { Util } from '../../../../../shared/utils/utils';

@Component({
  selector: 'app-achievement-card',
  templateUrl: './achievement-card.component.html',
  styleUrls: ['./achievement-card.component.scss'],
})
export class AchievementCardComponent {
  @Input() achievement: Achievement;
  @Input() achievementsTypes: AchievementType[];
  @Input() workshop: Workshop;
  @Input() isAllowedEdit: boolean;

  @Output() deleteAchievement = new EventEmitter<Achievement>();

  showMore = false;

  constructor() {}

  onDelete(): void {
    this.deleteAchievement.emit(this.achievement);
  }

  getFullName(person: Person): string {
    return Util.getFullName(person);
  }
}
