import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Actions, Store, ofActionCompleted } from '@ngxs/store';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { CategoryIcons } from '../../../shared/enum/category-icons';
import { RecruitmentStatusUkr } from '../../../shared/enum/enumUA/workshop';
import { NavBarName } from '../../../shared/enum/navigation-bar';
import { Role, EntityType } from '../../../shared/enum/role';
import { WorkshopOpenStatus } from '../../../shared/enum/workshop';
import { ImgPath } from '../../../shared/models/carousel.model';
import { Provider } from '../../../shared/models/provider.model';
import { Workshop } from '../../../shared/models/workshop.model';
import { ImagesService } from '../../../shared/services/images/images.service';
import { NavigationBarService } from '../../../shared/services/navigation-bar/navigation-bar.service';
import { GetRateByEntityId } from '../../../shared/store/meta-data.actions';
import { AddNavPath } from '../../../shared/store/navigation.actions';
import { OnCreateRatingSuccess } from '../../../shared/store/parent.actions';
import { ResetAchievements } from '../../../shared/store/provider.actions';
import { GetWorkshopById, GetProviderById, GetWorkshopsByProviderId } from '../../../shared/store/shared-user.actions';
e_file_a14356;

@Component({
  selector: 'app-workshop-details',
  templateUrl: './workshop-details.component.html',
  styleUrls: ['./workshop-details.component.scss'],
})
export class WorkshopDetailsComponent implements OnInit, OnDestroy {
  readonly categoryIcons = CategoryIcons;
  readonly recruitmentStatusUkr = RecruitmentStatusUkr;
  readonly workhopStatus = WorkshopOpenStatus;

  @Input() role: Role;
  @Input() workshop: Workshop;
  @Input() provider: Provider;
  @Input() isMobileScreen: boolean;
  @Input() displayActionCard: boolean;

  workshopStatusOpen: boolean;
  selectedIndex: number;
  destroy$: Subject<boolean> = new Subject<boolean>();
  images: ImgPath[] = [];

  constructor(
    private route: ActivatedRoute,
    private imagesService: ImagesService,
    private actions$: Actions,
    private store: Store,
    private navigationBarService: NavigationBarService
  ) {}

  ngOnInit(): void {
    this.getWorkshopData();

    this.workshopStatusOpen = this.workshop.status === this.workhopStatus.Open;

    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(() => (this.selectedIndex = 0));
    this.actions$
      .pipe(ofActionCompleted(OnCreateRatingSuccess))
      .pipe(takeUntil(this.destroy$), distinctUntilChanged())
      .subscribe(() => this.store.dispatch(new GetWorkshopById(this.workshop.id)));
  }

  private getWorkshopData(): void {
    this.images = this.imagesService.setCarouselImages(this.workshop);
    this.store.dispatch([
      new GetProviderById(this.workshop.providerId),
      new GetRateByEntityId(EntityType.workshop, this.workshop.id),
      new GetWorkshopsByProviderId(this.workshop.providerId, this.workshop.id),
      new AddNavPath(
        this.navigationBarService.createNavPaths(
          {
            name: NavBarName.WorkshopResult,
            path: '/result',
            isActive: false,
            disable: false,
          },
          { name: this.workshop.title, isActive: false, disable: true }
        )
      ),
    ]);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(new ResetAchievements());
  }
}
