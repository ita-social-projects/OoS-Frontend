import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, combineLatest } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ConfirmationModalWindowComponent } from '../../../../shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants, PaginationConstants } from '../../../../shared/constants/constants';
import { ModalConfirmationType } from '../../../../shared/enum/modal-confirmation';
import { NoResultsTitle } from '../../../../shared/enum/no-results';
import { Achievement, AchievementParameters, AchievementType } from '../../../../shared/models/achievement.model';
import { Provider } from '../../../../shared/models/provider.model';
import { Workshop } from '../../../../shared/models/workshop.model';
import { GetAchievementsType } from '../../../../shared/store/meta-data.actions';
import { MetaDataState } from '../../../../shared/store/meta-data.state';
import { GetAchievementsByWorkshopId, DeleteAchievementById } from '../../../../shared/store/provider.actions';
import { ProviderState } from '../../../../shared/store/provider.state';
import { RegistrationState } from '../../../../shared/store/registration.state';
import { SearchResponse } from '../../../../shared/models/search.model';
import { PaginationElement } from '../../../../shared/models/paginationElement.model';
import { Util } from '../../../../shared/utils/utils';

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.scss']
})
export class AchievementsComponent implements OnInit, OnDestroy {
  readonly noResultAchievements = NoResultsTitle.noAchievements;

  @Input() workshop: Workshop;

  @Select(ProviderState.achievements)
  achievements$: Observable<SearchResponse<Achievement[]>>;
  achievements: SearchResponse<Achievement[]>;
  @Select(MetaDataState.achievementsTypes)
  achievementsTypes$: Observable<AchievementType[]>;
  achievementsTypes: AchievementType[];
  @Select(ProviderState.isLoading)
  isLoading$: Observable<boolean>;

  destroy$: Subject<boolean> = new Subject<boolean>();
  provider: Provider;
  currentPage: PaginationElement = PaginationConstants.firstPage;
  isAllowedEdit: boolean;
  achievementParameters: AchievementParameters = {
    workshopId: ''
  };

  constructor(private store: Store, private matDialog: MatDialog) {}

  ngOnInit(): void {
    const achievementPerPage = PaginationConstants.ACHIEVEMENT_PER_PAGE;
    this.achievementParameters.workshopId = this.workshop.id;
    Util.setPaginationParams(this.achievementParameters, this.currentPage, achievementPerPage);

    const provider = this.store.selectSnapshot<Provider>(RegistrationState.provider);
    this.isAllowedEdit = this.workshop.providerId === provider?.id;

    this.getAchievements();
    combineLatest([this.achievements$, this.achievementsTypes$])
      .pipe(
        takeUntil(this.destroy$),
        filter(([achievements]: [SearchResponse<Achievement[]>, AchievementType[]]) => !!achievements)
      )
      .subscribe(([achievements, achievementsTypes]: [SearchResponse<Achievement[]>, AchievementType[]]) => {
        this.achievementsTypes = achievementsTypes;
        this.achievements = achievements;
      });
  }

  private getAchievements(): void {
    this.store.dispatch([new GetAchievementsType(), new GetAchievementsByWorkshopId(this.achievementParameters)]);
  }

  onDelete(achievement: Achievement): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.deleteAchievement,
        property: ''
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      result && this.store.dispatch(new DeleteAchievementById(achievement.id));
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    Util.setPaginationParams(this.achievementParameters, this.currentPage, this.achievementParameters.size);
    this.store.dispatch(new GetAchievementsByWorkshopId(this.achievementParameters));
  }

  onItemsPerPageChange(itemPerPage: number) {
    Util.setPaginationParams(this.achievementParameters, this.currentPage, itemPerPage);
    this.store.dispatch(new GetAchievementsByWorkshopId(this.achievementParameters));
  }
}
