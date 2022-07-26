import { Component, Input, OnInit } from '@angular/core';
import { AchievementsTitle } from '../../constants/constants';
import { Achievement } from '../../models/achievement.model';
import { Person } from '../../models/user.model';
import { Workshop } from '../../models/workshop.model';
import { Util } from '../../utils/utils';

@Component({
  selector: 'app-achievement-card',
  templateUrl: './achievement-card.component.html',
  styleUrls: ['./achievement-card.component.scss'],
})
export class AchievementCardComponent implements OnInit {
  readonly achievementsTitle = AchievementsTitle;

  @Input() achievement: Achievement;
  @Input() workshop: Workshop;
  @Input() isAllowedEdit: boolean;
  
  showMore = false;
  
  constructor() {}

  ngOnInit(): void {}

  private getFullName(person: Person): string {
    return Util.getFullName(person);
  }

}
