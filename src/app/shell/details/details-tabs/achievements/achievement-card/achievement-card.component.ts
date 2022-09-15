import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Constants } from 'src/app/shared/constants/constants';
import { Achievement, AchievementType } from '../../../../../shared/models/achievement.model';
import { Workshop } from '../../../../../shared/models/workshop.model';

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

  readonly tooltipPosition = Constants.MAT_TOOL_TIP_POSITION_BELOW;

  showMore = false;

  constructor() {}

  onDelete(): void {
    this.deleteAchievement.emit(this.achievement);
  }
}
