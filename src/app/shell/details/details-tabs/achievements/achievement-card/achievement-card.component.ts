import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngxs/store';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';
import { Achievement, AchievementType } from '../../../../../shared/models/achievement.model';
import { Person } from '../../../../../shared/models/user.model';
import { Workshop } from '../../../../../shared/models/workshop.model';
import { Util } from '../../../../../shared/utils/utils';

@Component({
  selector: 'app-achievement-card',
  templateUrl: './achievement-card.component.html',
  styleUrls: ['./achievement-card.component.scss'],
})
export class AchievementCardComponent implements OnInit {
  @Input() achievement: Achievement;
  @Input() workshop: Workshop;
  @Input() isAllowedEdit: boolean;

  @Output() deleteAchievement = new EventEmitter<Achievement>();
  achievementsTypes: AchievementType[];
  showMore = false;
  
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.achievementsTypes = this.store.selectSnapshot<AchievementType[]>(MetaDataState.achievementsTypes);
  }

  onDelete(): void {
    this.deleteAchievement.emit(this.achievement);
  }

  private getFullName(person: Person): string {
    return Util.getFullName(person);
  }

}
