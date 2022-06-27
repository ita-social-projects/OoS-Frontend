import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { NoResultsTitle } from 'src/app/shared/enum/no-results';
import { Achievement } from 'src/app/shared/models/achievement.model';
import { getAchievementsByWorkshopId, GetWorkshopById } from 'src/app/shared/store/user.actions';

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.scss'],
})
export class AchievementsComponent implements OnInit {
  workshopId: string;
  readonly noResultAchievements = NoResultsTitle.noAchievements;

  @Input() achievements: Achievement[];

  constructor(private store: Store, private route: ActivatedRoute,) {}

  ngOnInit(): void {
    this.workshopId = this.route.snapshot.paramMap.get('param')
    this.store.dispatch(new GetWorkshopById(this.workshopId));
    this.store.dispatch(new getAchievementsByWorkshopId(this.workshopId));
  }
}
