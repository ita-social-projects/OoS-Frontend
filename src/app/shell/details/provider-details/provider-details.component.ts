import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { EntityType, Role } from 'src/app/shared/enum/role';
import { Provider } from 'src/app/shared/models/provider.model';
import { takeUntil } from 'rxjs/operators';
import { imgPath } from 'src/app/shared/models/carousel.model';
import { ImagesService } from 'src/app/shared/services/images/images.service';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { GetRateByEntityId } from 'src/app/shared/store/meta-data.actions';
import { GetWorkshopsByProviderId } from 'src/app/shared/store/shared-user.actions';
import { AddNavPath } from 'src/app/shared/store/navigation.actions';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';

@Component({
  selector: 'app-provider-details',
  templateUrl: './provider-details.component.html',
  styleUrls: ['./provider-details.component.scss']
})
export class ProviderDetailsComponent implements OnInit, OnDestroy  {
  @Input() role: Role;
  @Input() provider: Provider;

  selectedIndex: number;
  destroy$: Subject<boolean> = new Subject<boolean>();
  images: imgPath[] = [];

  constructor(
    private route: ActivatedRoute,
    private imagesService: ImagesService,
    private store: Store,
    private navigationBarService: NavigationBarService) { }

  ngOnInit(): void {
    this.getProviderData();
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => (this.selectedIndex = 0));
  }

  private getProviderData(): void {
    this.images = this.imagesService.setCarouselImages(this.provider);
    this.store.dispatch([
      new GetRateByEntityId(EntityType.provider, this.provider.id),
      new GetWorkshopsByProviderId(this.provider.id),
      new AddNavPath(
        this.navigationBarService.createNavPaths(
          { name: NavBarName.WorkshopResult, path: '/result', isActive: false, disable: false },
          { name: this.provider.fullTitle, isActive: false, disable: true },
        ))
    ]);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
