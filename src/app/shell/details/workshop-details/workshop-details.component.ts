import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Actions, ofAction, Store } from '@ngxs/store';
import { of, Subject } from 'rxjs';
import { debounceTime, filter, switchMap, take, takeUntil, tap } from 'rxjs/operators';

import { Constants, PaginationConstants } from 'shared/constants/constants';
import { CategoryIcons } from 'shared/enum/category-icons';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { DetailsTabTitlesEnum, FormOfLearningEnum, RecruitmentStatusEnum } from 'shared/enum/enumUA/workshop';
import { Role } from 'shared/enum/role';
import { DetailsTabTitlesParams, WorkshopDraftStatus, WorkshopOpenStatus } from 'shared/enum/workshop';
import { Provider, ProviderParameters } from 'shared/models/provider.model';
import { Workshop, WorkshopDraft } from 'shared/models/workshop.model';
import { ImagesService } from 'shared/services/images/images.service';
import { NavigationBarService } from 'shared/services/navigation-bar/navigation-bar.service';
import { AddNavPath } from 'shared/store/navigation.actions';
import {
  DraftSendForModeration,
  GetWorkshopDraftIdByWorkshopId,
  OnDraftSendForModerationSuccess,
  OnGetWorkshopDraftIdByWorkshopIdSuccess,
  ResetAchievements
} from 'shared/store/provider.actions';
import { GetProviderById, GetWorkshopDraftById } from 'shared/store/shared-user.actions';
import { InfoMenuType } from 'shared/enum/info-menu-type';
import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { Util } from 'shared/utils/utils';
import { isRoleProvider } from 'shared/utils/provider.utils';
import { ShowMessageBar } from 'shared/store/app.actions';

@Component({
  selector: 'app-workshop-details',
  templateUrl: './workshop-details.component.html',
  styleUrls: ['./workshop-details.component.scss']
})
export class WorkshopDetailsComponent implements OnInit, OnDestroy {
  @ViewChild(MatTabGroup)
  public tabGroup: MatTabGroup;

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
  public tabIndex: number;
  public coverImage: string;

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
    private readonly actions$: Actions,
    private readonly translateService: TranslateService
  ) {}

  public ngOnInit(): void {
    this.providerParameters.excludedWorkshopId = this.workshop.id ? this.workshop.id : '';
    this.providerParameters.providerId = Util.containsWorkshopDetails(this.workshop)
      ? this.workshop.workshopDetails.providerId
      : this.workshop.providerId;
    this.getWorkshopData();

    this.workshopStatusOpen = this.workshop.status === this.workshopStatus.Open;

    this.route.queryParams.pipe(takeUntil(this.destroy$), debounceTime(500)).subscribe((params: Params) => {
      this.tabIndex = Object.keys(DetailsTabTitlesEnum).indexOf(params.status);
      this.selectedIndex = this.tabIndex;
    });
  }

  public onTabChange(event: MatTabChangeEvent): void {
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: { status: DetailsTabTitlesParams[event.index] }
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

    this.store.dispatch(new GetWorkshopDraftIdByWorkshopId(workshopId));

    this.actions$
      .pipe(ofAction(OnGetWorkshopDraftIdByWorkshopIdSuccess), take(1))
      .subscribe((action: OnGetWorkshopDraftIdByWorkshopIdSuccess) => {
        if (!action.draftId) {
          this.router.navigate(['/create/workshop', workshopId]);
        } else {
          this.dialog
            .open(ConfirmationModalWindowComponent, {
              width: Constants.MODAL_SMALL,
              data: {
                type: ModalConfirmationType.draftExistsSet
              }
            })
            .afterClosed()
            .pipe(take(1), filter(Boolean))
            .subscribe(() => {
              this.router.navigate(['/create/draft', action.draftId]).then(() => {
                this.store.dispatch(
                  new ShowMessageBar({
                    type: 'warningBlue',
                    message: this.translateService.instant('SERVICE_MESSAGES.SNACK_BAR_TEXT.REDIRECTED_TO_DRAFT')
                  })
                );
              });
            });
        }
      });
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
}
