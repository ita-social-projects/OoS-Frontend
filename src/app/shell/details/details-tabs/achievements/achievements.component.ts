import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, combineLatest } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants, PaginationConstants } from 'shared/constants/constants';
import { NoResultsTitle } from 'shared/enum/enumUA/no-results';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { Achievement, AchievementParameters, AchievementType } from 'shared/models/achievement.model';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { Provider } from 'shared/models/provider.model';
import { SearchResponse } from 'shared/models/search.model';
import { Workshop } from 'shared/models/workshop.model';
import { GetAchievementsType } from 'shared/store/meta-data.actions';
import { MetaDataState } from 'shared/store/meta-data.state';
import { DeleteAchievementById, GetAchievementsByWorkshopId } from 'shared/store/provider.actions';
import { ProviderState } from 'shared/store/provider.state';
import { RegistrationState } from 'shared/store/registration.state';
import { Util } from 'shared/utils/utils';

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.scss']
})
export class AchievementsComponent implements OnInit, OnDestroy {
  @Input() public workshop: Workshop;

  @Select(ProviderState.achievements)
  public achievements$: Observable<SearchResponse<Achievement[]>>;
  @Select(MetaDataState.achievementsTypes)
  public achievementsTypes$: Observable<AchievementType[]>;
  @Select(ProviderState.isLoading)
  public isLoading$: Observable<boolean>;

  public readonly noResultAchievements = NoResultsTitle.noAchievements;

  public achievements: SearchResponse<Achievement[]>;
  public achievementsTypes: AchievementType[];
  public provider: Provider;
  public isAllowedEdit: boolean;
  public currentPage: PaginationElement = PaginationConstants.firstPage;
  public achievementParameters: AchievementParameters = {
    workshopId: '',
    size: PaginationConstants.ACHIEVEMENTS_PER_PAGE
  };

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private store: Store,
    private matDialog: MatDialog
  ) {}

  public ngOnInit(): void {
    const provider = this.store.selectSnapshot<Provider>(RegistrationState.provider);
    this.isAllowedEdit = this.workshop.providerId === provider?.id;
    this.achievementParameters.workshopId = this.workshop.id;
    this.store.dispatch(new GetAchievementsType());
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

  public onDelete(achievement: Achievement): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.deleteAchievement,
        property: ''
      }
    });

    dialogRef
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => {
        this.store.dispatch(new DeleteAchievementById(achievement));
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.getAchievements();
  }

  public onItemsPerPageChange(itemsPerPage: number): void {
    this.achievementParameters.size = itemsPerPage;
    this.onPageChange(PaginationConstants.firstPage);
  }

  private getAchievements(): void {
    Util.setFromPaginationParam(this.achievementParameters, this.currentPage, this.achievements?.totalAmount);
    this.store.dispatch(new GetAchievementsByWorkshopId(this.achievementParameters));
  }
}
