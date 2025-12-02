import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Constants } from 'shared/constants/constants';
import { Achievement, AchievementType } from 'shared/models/achievement.model';
import { Workshop } from 'shared/models/workshop.model';

@Component({
  selector: 'app-achievement-card',
  templateUrl: './achievement-card.component.html',
  styleUrls: ['./achievement-card.component.scss']
})
export class AchievementCardComponent {
  @Input() public achievement: Achievement;
  @Input() public achievementsTypes: AchievementType[];
  @Input() public workshop: Workshop;
  @Input() public isAllowedEdit: boolean;

  @Output() public deleteAchievement = new EventEmitter<Achievement>();

  public readonly tooltipPosition = Constants.MAT_TOOL_TIP_POSITION_BELOW;

  public showMore = false;

  constructor() {}

  public onDelete(): void {
    this.deleteAchievement.emit(this.achievement);
  }
}
