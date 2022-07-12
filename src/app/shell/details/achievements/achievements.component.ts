import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { AchievementsTitle, Constants } from 'src/app/shared/constants/constants';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { NoResultsTitle } from 'src/app/shared/enum/no-results';
import { Achievement } from 'src/app/shared/models/achievement.model';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { DeleteAchievementById, GetAchievementsByWorkshopId } from 'src/app/shared/store/user.actions';

import { UserState } from 'src/app/shared/store/user.state';

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.scss'],
})
export class AchievementsComponent implements OnInit {
  @Input() workshop: Workshop;
  readonly noResultAchievements = NoResultsTitle.noAchievements;
  readonly achievementsTitle = AchievementsTitle;
  achievements: Achievement[];
  readonly noResultAchievements = NoResultsTitle.noAchievements;
  @Input() achievements: Achievement[];

  @Select(UserState.achievements)
  achievements$: Observable<Achievement[]>;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store, private matDialog: MatDialog) {}

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
    this.store.dispatch(new GetAchievementsByWorkshopId(this.workshop?.id));
  }  

  onDelete(achievement: Achievement): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.deleteAchievement,
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      (result) && this.store.dispatch(new DeleteAchievementById(achievement.id));
    });
  }


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
