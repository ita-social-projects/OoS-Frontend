import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { Subject, takeUntil } from 'rxjs';
import { NavBarName } from '../../../shared/enum/enumUA/navigation-bar';
import { Role, EntityType } from '../../../shared/enum/role';
import { ImgPath } from '../../../shared/models/carousel.model';
import { Provider, ProviderParameters } from '../../../shared/models/provider.model';
import { ImagesService } from '../../../shared/services/images/images.service';
import { NavigationBarService } from '../../../shared/services/navigation-bar/navigation-bar.service';
import { GetRateByEntityId } from '../../../shared/store/meta-data.actions';
import { AddNavPath } from '../../../shared/store/navigation.actions';
import { GetWorkshopsByProviderId } from '../../../shared/store/shared-user.actions';
import { DetailsTabTitlesEnum } from '../../../shared/enum/enumUA/workshop';
import { PaginationConstants } from '../../../shared/constants/constants';

@Component({
  selector: 'app-provider-details',
  templateUrl: './provider-details.component.html',
  styleUrls: ['./provider-details.component.scss']
})
export class ProviderDetailsComponent implements OnInit, OnDestroy {
  readonly tabTitles = DetailsTabTitlesEnum;
  @Input() role: Role;
  @Input() provider: Provider;

  selectedIndex: number;
  destroy$: Subject<boolean> = new Subject<boolean>();
  images: ImgPath[] = [];
  providerParameters: ProviderParameters = {
    providerId: '',
    size: PaginationConstants.WORKSHOPS_PER_PAGE
  };

  constructor(
    private route: ActivatedRoute,
    private imagesService: ImagesService,
    private store: Store,
    private navigationBarService: NavigationBarService
  ) {}

  ngOnInit(): void {
    this.providerParameters.providerId = this.provider.id;
    this.getProviderData();
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(() => (this.selectedIndex = 0));
  }

  private getProviderData(): void {
    this.images = this.imagesService.setCarouselImages(this.provider);
    this.store.dispatch([
      new AddNavPath(
        this.navigationBarService.createNavPaths(
          { name: NavBarName.WorkshopResult, path: '/result', isActive: false, disable: false },
          { name: this.provider.fullTitle, isActive: false, disable: true }
        )
      )
    ]);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
