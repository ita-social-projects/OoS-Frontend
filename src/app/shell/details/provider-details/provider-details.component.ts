import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { WINDOW } from 'ngx-window-token';

import { PaginationConstants } from 'shared/constants/constants';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { DetailsTabTitlesEnum } from 'shared/enum/enumUA/workshop';
import { Role } from 'shared/enum/role';
import { Provider, ProviderParameters } from 'shared/models/provider.model';
import { ImagesService } from 'shared/services/images/images.service';
import { NavigationBarService } from 'shared/services/navigation-bar/navigation-bar.service';
import { AddNavPath } from 'shared/store/navigation.actions';
import { TabParamsComponent } from '../details-tabs/tab-params.component';

@Component({
  selector: 'app-provider-details',
  templateUrl: './provider-details.component.html',
  styleUrls: ['./provider-details.component.scss']
})
export class ProviderDetailsComponent extends TabParamsComponent implements OnInit, OnDestroy {
  @Input() public role: Role;
  @Input() public provider: Provider;

  public readonly tabTitles = DetailsTabTitlesEnum;
  public providerParameters: ProviderParameters = {
    providerId: '',
    size: PaginationConstants.WORKSHOPS_PER_PAGE
  };

  public coverImage: string;

  constructor(
    @Inject(WINDOW) protected window: Window,
    protected readonly route: ActivatedRoute,
    protected readonly router: Router,
    private readonly imagesService: ImagesService,
    private readonly store: Store,
    private readonly navigationBarService: NavigationBarService
  ) {
    super(window, route, router);
  }

  public ngOnInit(): void {
    this.providerParameters.providerId = this.provider.id;
    this.getProviderData();
  }

  protected initTabs(): void {
    this.tabs = [
      {
        alias: 'AboutProvider',
        labelKey: this.tabTitles.AboutProvider,
        visible: true
      },
      {
        alias: 'ProviderWorkshops',
        labelKey: this.tabTitles.Workshops,
        visible: true
      },
      {
        alias: 'Contacts',
        labelKey: this.tabTitles.Contacts,
        visible: true
      },
      {
        alias: 'Images',
        labelKey: this.tabTitles.Images,
        visible: true
      }
    ].filter((tab) => tab.visible);
  }

  private getProviderData(): void {
    this.coverImage = this.imagesService.getCoverImage(this.provider);
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
