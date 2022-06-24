import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Actions, ofAction, Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { CategoryIcons } from 'src/app/shared/enum/category-icons';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { EntityType, Role } from 'src/app/shared/enum/role';
import { imgPath } from 'src/app/shared/models/carousel.model';
import { Provider } from 'src/app/shared/models/provider.model';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { ImagesService } from 'src/app/shared/services/images/images.service';
import { GetRateByEntityId } from 'src/app/shared/store/meta-data.actions';
import { AddNavPath } from 'src/app/shared/store/navigation.actions';
import { GetProviderById, GetWorkshopById, GetWorkshopsByProviderId, OnCreateRatingSuccess } from 'src/app/shared/store/user.actions';

@Component({
  selector: 'app-workshop-details',
  templateUrl: './workshop-details.component.html',
  styleUrls: ['./workshop-details.component.scss'],
})
export class WorkshopDetailsComponent implements OnInit, OnDestroy {
  readonly categoryIcons = CategoryIcons;

  @Input() role: Role;
  @Input() workshop: Workshop;
  @Input() provider: Provider;
  @Input() isMobileScreen: boolean;
  @Input() displayActionCard: boolean;

  selectedIndex: number;
  destroy$: Subject<boolean> = new Subject<boolean>();
  images: imgPath[] = [];

  constructor(
    private route: ActivatedRoute,
    private imagesService: ImagesService,
    private actions$: Actions,
    private store: Store,
    private navigationBarService: NavigationBarService
  ) {}

  ngOnInit(): void {
    this.getWorkshopData();

    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => (this.selectedIndex = 0));
    this.actions$
      .pipe(ofAction(OnCreateRatingSuccess))
      .pipe(takeUntil(this.destroy$), distinctUntilChanged())
      .subscribe(() => this.store.dispatch(new GetWorkshopById(this.workshop.id)));
  }

  private getWorkshopData(): void {
    this.images = this.imagesService.setCarouselImages(this.workshop);
    this.store.dispatch([
      new GetProviderById(this.workshop.providerId),
      new GetRateByEntityId(EntityType.workshop, this.workshop.id),
      new GetWorkshopsByProviderId(this.workshop.providerId),
      new AddNavPath(
        this.navigationBarService.createNavPaths(
          {
            name: NavBarName.TopWorkshops,
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
  }
}
