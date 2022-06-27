import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { NoResultsTitle } from 'src/app/shared/enum/no-results';
import { Achievement } from 'src/app/shared/models/achievement.model';
import { Workshop } from 'src/app/shared/models/workshop.model';
// import { GetAchievementsByWorkshopId } from 'src/app/shared/store/user.actions';

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.scss'],
})
export class AchievementsComponent implements OnInit {
  readonly noResultAchievements = NoResultsTitle.noAchievements;

  @Input() workshop: Workshop;
  achievements: Achievement[];

  constructor(private store: Store) {}

  ngOnInit(): void {
    // this.store.dispatch(new GetAchievementsByWorkshopId(this.workshop.id));
  }
}
