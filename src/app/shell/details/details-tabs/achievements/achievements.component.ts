import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, combineLatest } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ConfirmationModalWindowComponent } from '../../../../shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants } from '../../../../shared/constants/constants';
import { ModalConfirmationType } from '../../../../shared/enum/modal-confirmation';
import { NoResultsTitle } from '../../../../shared/enum/no-results';
import { Achievement, AchievementType } from '../../../../shared/models/achievement.model';
import { Provider } from '../../../../shared/models/provider.model';
import { Workshop } from '../../../../shared/models/workshop.model';
import { GetAchievementsType } from '../../../../shared/store/meta-data.actions';
import { MetaDataState } from '../../../../shared/store/meta-data.state';
import { GetAchievementsByWorkshopId, DeleteAchievementById } from '../../../../shared/store/provider.actions';
import { ProviderState } from '../../../../shared/store/provider.state';
import { RegistrationState } from '../../../../shared/store/registration.state';

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.scss'],
})
export class AchievementsComponent implements OnInit, OnDestroy {
  readonly noResultAchievements = NoResultsTitle.noAchievements;

  @Select(ProviderState.achievements)
  achievements$: Observable<Achievement[]>;
  @Select(MetaDataState.achievementsTypes)
  achievementsTypes$: Observable<AchievementType[]>;

  @Input() workshop: Workshop;

  destroy$: Subject<boolean> = new Subject<boolean>();
  achievements: Achievement[];
  achievementsTypes: AchievementType[];
  provider: Provider;
  isAllowedEdit: boolean;

  constructor(private store: Store, private matDialog: MatDialog) {}

  ngOnInit(): void {
    const provider = this.store.selectSnapshot<Provider>(RegistrationState.provider);
    this.isAllowedEdit = this.workshop.providerId === provider?.id;

    this.getAchievements();
    combineLatest([this.achievements$, this.achievementsTypes$])
      .pipe(
        takeUntil(this.destroy$),
        filter(([achievements, achievementsTypes]: [Achievement[], AchievementType[]]) => !!achievements)
      )
      .subscribe(([achievements, achievementsTypes]: [Achievement[], AchievementType[]]) => {
        this.achievementsTypes = achievementsTypes;
        this.achievements = achievements;
      });
  }

  private getAchievements(): void {
    this.store.dispatch([new GetAchievementsType(), new GetAchievementsByWorkshopId(this.workshop.id)]);
  }

  onDelete(achievement: Achievement): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.deleteAchievement,
        property: '',
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      result && this.store.dispatch(new DeleteAchievementById(achievement.id));
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
