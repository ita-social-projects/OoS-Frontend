import { Component, Input, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { NoResultsTitle } from 'src/app/shared/enum/no-results';
import { Achievement } from 'src/app/shared/models/achievement.model';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { GetAchievementsByWorkshopId } from 'src/app/shared/store/user.actions';
import { UserState } from 'src/app/shared/store/user.state';

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.scss'],
})
export class AchievementsComponent implements OnInit {
  readonly noResultAchievements = NoResultsTitle.noAchievements;
  @Input() achievements: Achievement[];

  @Select(UserState.achievements)
  achievements$: Observable<Achievement[]>;
  @Input() workshop: Workshop;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store) {}

  ngOnInit(): void {   
    this.getAchievements();    
    this.achievements$
      .pipe(
        takeUntil(this.destroy$),
        filter((achievements) => !!achievements)
      ).subscribe((achievements) => {
        this.achievements = achievements;
      });
  }  

  private getAchievements(): void {
    // this.store.dispatch(new GetAchievementsByWorkshopId(this.workshop.id));
  }

  ngOnDestroy(): void {
    this.destroy$.unsubscribe();
  }
}
