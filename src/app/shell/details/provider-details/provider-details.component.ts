import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { Subject, takeUntil } from 'rxjs';
import { NavBarName } from '../../../shared/enum/enumUA/navigation-bar';
import { Role, EntityType } from '../../../shared/enum/role';
import { ImgPath } from '../../../shared/models/carousel.model';
import { Provider } from '../../../shared/models/provider.model';
import { ImagesService } from '../../../shared/services/images/images.service';
import { NavigationBarService } from '../../../shared/services/navigation-bar/navigation-bar.service';
import { GetRateByEntityId } from '../../../shared/store/meta-data.actions';
import { AddNavPath } from '../../../shared/store/navigation.actions';
import { GetWorkshopsByProviderId } from '../../../shared/store/shared-user.actions';
import { DetailsTabTitlesEnum } from '../../../shared/enum/enumUA/workshop';

@Component({
  selector: 'app-provider-details',
  templateUrl: './provider-details.component.html',
  styleUrls: ['./provider-details.component.scss'],
})
export class ProviderDetailsComponent implements OnInit, OnDestroy {
  readonly tabTitles = DetailsTabTitlesEnum;
  @Input() role: Role;
  @Input() provider: Provider;

  selectedIndex: number;
  destroy$: Subject<boolean> = new Subject<boolean>();
  images: ImgPath[] = [];

  constructor(
    private route: ActivatedRoute,
    private imagesService: ImagesService,
    private store: Store,
    private navigationBarService: NavigationBarService
  ) {}

  ngOnInit(): void {
    this.getProviderData();
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(() => (this.selectedIndex = 0));
  }

  getWorkshops(): void {
    this.store.dispatch(new GetWorkshopsByProviderId(this.provider.id));
  }

  private getProviderData(): void {
    this.images = this.imagesService.setCarouselImages(this.provider);
    this.getWorkshops();
    this.store.dispatch([
      new GetRateByEntityId(EntityType.provider, this.provider.id),
      new AddNavPath(
        this.navigationBarService.createNavPaths(
          { name: NavBarName.WorkshopResult, path: '/result', isActive: false, disable: false },
          { name: this.provider.fullTitle, isActive: false, disable: true }
        )
      ),
    ]);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
