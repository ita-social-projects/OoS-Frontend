import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { Subject, takeUntil } from 'rxjs';

import { PaginationConstants } from 'shared/constants/constants';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { DetailsTabTitlesEnum } from 'shared/enum/enumUA/workshop';
import { Role } from 'shared/enum/role';
import { Provider, ProviderParameters } from 'shared/models/provider.model';
import { ImagesService } from 'shared/services/images/images.service';
import { NavigationBarService } from 'shared/services/navigation-bar/navigation-bar.service';
import { AddNavPath } from 'shared/store/navigation.actions';

@Component({
  selector: 'app-provider-details',
  templateUrl: './provider-details.component.html',
  styleUrls: ['./provider-details.component.scss']
})
export class ProviderDetailsComponent implements OnInit, OnDestroy {
  @Input() public role: Role;
  @Input() public provider: Provider;

  public readonly tabTitles = DetailsTabTitlesEnum;
  public coverImage: string;
  public selectedIndex: number;
  public providerParameters: ProviderParameters = {
    providerId: '',
    size: PaginationConstants.WORKSHOPS_PER_PAGE
  };
  private readonly destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly imagesService: ImagesService,
    private readonly store: Store,
    private readonly navigationBarService: NavigationBarService
  ) {}

  public ngOnInit(): void {
    this.providerParameters.providerId = this.provider.id;
    this.getProviderData();
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(() => (this.selectedIndex = 0));
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private getProviderData(): void {
    this.coverImage = this.imagesService.setCoverImage(this.provider);
    this.store.dispatch([
      new AddNavPath(
        this.navigationBarService.createNavPaths(
          { name: NavBarName.WorkshopResult, path: '/result', isActive: false, disable: false },
          { name: this.provider.fullTitle, isActive: false, disable: true }
        )
      )
    ]);
  }
}
