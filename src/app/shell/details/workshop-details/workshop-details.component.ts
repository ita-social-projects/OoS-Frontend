import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { PaginationConstants } from '../../../shared/constants/constants';
import { CategoryIcons } from '../../../shared/enum/category-icons';
import { DetailsTabTitlesEnum, RecruitmentStatusEnum } from '../../../shared/enum/enumUA/workshop';
import { NavBarName } from '../../../shared/enum/enumUA/navigation-bar';
import { Role, EntityType } from '../../../shared/enum/role';
import { DetailsTabTitlesParams, WorkshopOpenStatus } from '../../../shared/enum/workshop';
import { ImgPath } from '../../../shared/models/carousel.model';
import { Provider, ProviderParameters } from '../../../shared/models/provider.model';
import { Workshop } from '../../../shared/models/workshop.model';
import { ImagesService } from '../../../shared/services/images/images.service';
import { NavigationBarService } from '../../../shared/services/navigation-bar/navigation-bar.service';
import { GetRateByEntityId } from '../../../shared/store/meta-data.actions';
import { AddNavPath } from '../../../shared/store/navigation.actions';
import { ResetAchievements } from '../../../shared/store/provider.actions';
import { GetProviderById, GetWorkshopsByProviderId } from '../../../shared/store/shared-user.actions';

@Component({
  selector: 'app-workshop-details',
  templateUrl: './workshop-details.component.html',
  styleUrls: ['./workshop-details.component.scss']
})
export class WorkshopDetailsComponent implements OnInit, OnDestroy {
  readonly categoryIcons = CategoryIcons;
  readonly recruitmentStatusEnum = RecruitmentStatusEnum;
  readonly workshopStatus = WorkshopOpenStatus;
  readonly workshopTitles = DetailsTabTitlesEnum;

  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

  @Input() role: Role;
  @Input() workshop: Workshop;
  @Input() provider: Provider;
  @Input() isMobileScreen: boolean;
  @Input() displayActionCard: boolean;

  workshopStatusOpen: boolean;
  selectedIndex: number;
  tabIndex: number;
  destroy$: Subject<boolean> = new Subject<boolean>();
  images: ImgPath[] = [];
  providerParameters: ProviderParameters = {
    providerId: '',
    excludedWorkshopId: '',
    size: PaginationConstants.WORKSHOPS_PER_PAGE
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private imagesService: ImagesService,
    private store: Store,
    private navigationBarService: NavigationBarService
  ) {}

  ngOnInit(): void {
    this.providerParameters.excludedWorkshopId = this.workshop.id;
    this.providerParameters.providerId = this.workshop.providerId;
    this.getWorkshopData();

    this.workshopStatusOpen = this.workshop.status === this.workshopStatus.Open;

    this.route.queryParams.pipe(takeUntil(this.destroy$), debounceTime(500)).subscribe((params: Params) => {
      this.tabIndex = Object.keys(DetailsTabTitlesEnum).indexOf(params['status']);
      this.selectedIndex = this.tabIndex;
    });
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

  onTabChange(event: MatTabChangeEvent): void {
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: { status: DetailsTabTitlesParams[event.index] }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(new ResetAchievements());
  }
}
