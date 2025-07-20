import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Actions, ofAction, Store } from '@ngxs/store';
import { of, Subject } from 'rxjs';
import { debounceTime, filter, switchMap, take, takeUntil, tap } from 'rxjs/operators';

import { Constants, PaginationConstants } from 'shared/constants/constants';
import { CategoryIcons } from 'shared/enum/category-icons';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { DetailsTabTitlesEnum, FormOfLearningEnum, RecruitmentStatusEnum } from 'shared/enum/enumUA/workshop';
import { Role } from 'shared/enum/role';
import { WorkshopDraftStatus, WorkshopOpenStatus, WorkshopType } from 'shared/enum/workshop';
import { Provider, ProviderParameters } from 'shared/models/provider.model';
import { Workshop, WorkshopDraft } from 'shared/models/workshop.model';
import { ImagesService } from 'shared/services/images/images.service';
import { NavigationBarService } from 'shared/services/navigation-bar/navigation-bar.service';
import { AddNavPath } from 'shared/store/navigation.actions';
import {
  DraftSendForModeration,
  GetWorkshopDraftIdByWorkshopId,
  OnDraftSendForModerationSuccess,
  ResetAchievements
} from 'shared/store/provider.actions';
import { GetProviderById, GetWorkshopDraftById } from 'shared/store/shared-user.actions';
import { InfoMenuType } from 'shared/enum/info-menu-type';
import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { Util } from 'shared/utils/utils';
import { isRoleProvider } from 'shared/utils/provider.utils';
import { MetaDataState } from 'shared/store/meta-data.state';

@Component({
  selector: 'app-workshop-details',
  templateUrl: './workshop-details.component.html',
  styleUrls: ['./workshop-details.component.scss']
})
export class WorkshopDetailsComponent implements OnInit, OnDestroy {
  @Input()
  public role: Role;
  @Input()
  public workshop: Workshop | WorkshopDraft;
  @Input()
  public provider: Provider;
  @Input()
  public isMobileScreen: boolean;
  @Input()
  public displayActionCard: boolean;
  @Input()
  public currentProvider: Provider;

  public readonly categoryIcons = CategoryIcons;
  public readonly recruitmentStatusEnum = RecruitmentStatusEnum;
  public readonly workshopStatus = WorkshopOpenStatus;
  public readonly workshopTitles = DetailsTabTitlesEnum;
  public readonly WorkshopDraftStatus = WorkshopDraftStatus;
  public readonly FormOfLearningEnum = FormOfLearningEnum;
  public readonly Role = Role;
  public readonly InfoMenuType = InfoMenuType;
  public readonly modalType = ModalConfirmationType;

  public providerParameters: ProviderParameters = {
    providerId: '',
    excludedWorkshopId: '',
    size: PaginationConstants.WORKSHOPS_PER_PAGE
  };

  public isImageBroken: boolean = false;
  public workshopStatusOpen: boolean;
  public selectedIndex: number;
  public coverImage: string;
  public isAgeRestricted: boolean;

  protected tabs: { alias: string; labelKey: string; visible: boolean }[];
  protected readonly Util = Util;
  protected readonly ModalConfirmationType = ModalConfirmationType;
  protected readonly isRoleProvider = isRoleProvider;

  private readonly destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    protected readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly imagesService: ImagesService,
    private readonly store: Store,
    private readonly navigationBarService: NavigationBarService,
    private readonly dialog: MatDialog,
    private readonly actions$: Actions
  ) {}

  public ngOnInit(): void {
    this.providerParameters.excludedWorkshopId = this.workshop.id ? this.workshop.id : '';
    this.providerParameters.providerId = Util.containsWorkshopDetails(this.workshop)
      ? this.workshop.workshopDetails.providerId
      : this.workshop.providerId;
    this.getWorkshopData();

    this.workshopStatusOpen = this.workshop.status === this.workshopStatus.Open;

    this.initTabs();

    this.route.queryParams.pipe(takeUntil(this.destroy$), debounceTime(500)).subscribe((params: Params) => {
      const tabIndex = this.tabs.findIndex((tab) => tab.alias === params.tab);
      this.selectedIndex = tabIndex !== -1 ? tabIndex : 0;
    });

    this.isAgeRestricted = !(this.workshop.minAge === 0 && this.workshop.maxAge === 120);
  }

  public onTabChange(event: MatTabChangeEvent): void {
    const alias = this.tabs[event.index]?.alias;
    this.router.navigate([], {
      queryParams: { tab: alias },
      replaceUrl: true
    });
  }

  public onImageError(): void {
    this.isImageBroken = true;
    this.coverImage = this.imagesService.getDefaultCoverImage();
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(new ResetAchievements());
  }

  public onActionButtonClick(type: ModalConfirmationType): void {
    const dialogRef = this.dialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type
      }
    });
    dialogRef
      .afterClosed()
      .pipe(
        take(1),
        filter(Boolean),
        switchMap(() => {
          if (type === ModalConfirmationType.draftSet) {
            this.store.dispatch(new DraftSendForModeration((this.workshop as WorkshopDraft).workshopDraftId));

            return this.actions$.pipe(
              ofAction(OnDraftSendForModerationSuccess),
              take(1),
              tap(() => this.store.dispatch(new GetWorkshopDraftById((this.workshop as WorkshopDraft).workshopDraftId)))
            );
          }
          return of([]);
        })
      )
      .subscribe();
  }

  public onEdit(): void {
    const workshopId = this.route.snapshot.paramMap.get('id');
    if (this.route.snapshot.paramMap.get('entity') === WorkshopType.Draft) {
      this.router.navigate(['/create/draft', workshopId]);
    } else {
      this.store.dispatch(new GetWorkshopDraftIdByWorkshopId(workshopId));
    }
  }

  private getWorkshopData(): void {
    this.coverImage = this.imagesService.getCoverImage(this.workshop);
    this.store.dispatch([
      new GetProviderById(
        Util.containsWorkshopDetails(this.workshop) ? this.workshop.workshopDetails.providerId : this.workshop.providerId
      ),
      new AddNavPath(
        this.navigationBarService.createNavPaths(
          {
            name: NavBarName.WorkshopResult,
            path: '/result',
            isActive: false,
            disable: false
          },
          { name: this.workshop.title, isActive: false, disable: true }
        )
      )
    ]);
  }

  private initTabs(): void {
    this.tabs = [
      {
        alias: 'AboutWorkshop',
        labelKey: this.workshopTitles.AboutWorkshop,
        visible: true
      },
      {
        alias: 'AboutProvider',
        labelKey: this.workshopTitles.AboutProvider,
        visible: true
      },
      {
        alias: 'Teachers',
        labelKey: this.workshopTitles.Teachers,
        visible: true
      },
      {
        alias: 'OtherWorkshops',
        labelKey: this.workshopTitles.OtherWorkshops,
        visible: true
      },
      {
        alias: 'Reviews',
        labelKey: this.workshopTitles.Reviews,
        visible: this.role !== Role.unauthorized && this.workshop instanceof Workshop
      },
      {
        alias: 'Achievements',
        labelKey: this.workshopTitles.Achievements,
        visible: this.store.selectSnapshot(MetaDataState.featuresList).achievementManagement
      },
      {
        alias: 'Contacts',
        labelKey: this.workshopTitles.Contacts,
        visible: true
      }
    ].filter((tab) => tab.visible);
  }
}
