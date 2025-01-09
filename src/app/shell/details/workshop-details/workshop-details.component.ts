import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { debounceTime, filter, switchMap, takeUntil } from 'rxjs/operators';

import { Constants, PaginationConstants } from 'shared/constants/constants';
import { CategoryIcons } from 'shared/enum/category-icons';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { DetailsTabTitlesEnum, FormOfLearningEnum, RecruitmentStatusEnum } from 'shared/enum/enumUA/workshop';
import { Role } from 'shared/enum/role';
import { DetailsTabTitlesParams, FormOfLearning, WorkshopOpenStatus } from 'shared/enum/workshop';
import { ImgPath } from 'shared/models/carousel.model';
import { Provider, ProviderParameters } from 'shared/models/provider.model';
import { Workshop } from 'shared/models/workshop.model';
import { ImagesService } from 'shared/services/images/images.service';
import { NavigationBarService } from 'shared/services/navigation-bar/navigation-bar.service';
import { AddNavPath } from 'shared/store/navigation.actions';
import { PublishWorkshop, ResetAchievements } from 'shared/store/provider.actions';
import { GetProviderById } from 'shared/store/shared-user.actions';
import { InfoMenuType } from 'shared/enum/info-menu-type';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';

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
  public workshop: Workshop;
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
  public readonly FormOfLearningEnum = FormOfLearningEnum;
  public readonly Role = Role;
  public readonly InfoMenuType = InfoMenuType;
  public readonly modalType = ModalConfirmationType;

  public workshopStatusOpen: boolean;
  public selectedIndex: number;
  public tabIndex: number;
  public images: ImgPath[] = [];
  public providerParameters: ProviderParameters = {
    providerId: '',
    excludedWorkshopId: '',
    size: PaginationConstants.WORKSHOPS_PER_PAGE
  };

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private imagesService: ImagesService,
    private store: Store,
    private navigationBarService: NavigationBarService,
    private dialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.providerParameters.excludedWorkshopId = this.workshop.id;
    this.providerParameters.providerId = this.workshop.providerId;
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

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(new ResetAchievements());
  }

  public onActionButtonClick(modalType: ModalConfirmationType): void {
    const dialogRef = this.dialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: modalType
      }
    });
    dialogRef
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(() => {
          if (modalType === this.modalType.publishWorkshop) {
            return this.store.dispatch(new PublishWorkshop(this.workshop.providerId));
          }
        })
      )
      .subscribe();
  }

  private getWorkshopData(): void {
    this.images = this.imagesService.setCarouselImages(this.workshop);
    this.store.dispatch([
      new GetProviderById(this.workshop.providerId),
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
