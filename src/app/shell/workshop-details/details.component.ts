import { distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofAction, Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { Workshop, WorkshopCard } from 'src/app/shared/models/workshop.model';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { AddNavPath, DeleteNavPath } from 'src/app/shared/store/navigation.actions';
import { GetProviderById, GetWorkshopById, GetWorkshopsByProviderId, OnCreateRatingSuccess } from 'src/app/shared/store/user.actions';
import { UserState } from 'src/app/shared/store/user.state';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { Provider } from 'src/app/shared/models/provider.model';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { GetRateByEntityId } from 'src/app/shared/store/meta-data.actions';
import { Rate } from 'src/app/shared/models/rating';
import { AppState } from 'src/app/shared/store/app.state';
import { Location } from '@angular/common';
import { EntityType } from 'src/app/shared/enum/role';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {
  @Select(AppState.isMobileScreen) isMobileScreen$: Observable<boolean>;
  @Select(UserState.selectedWorkshop) workshop$: Observable<Workshop>;
  @Select(UserState.selectedProvider) provider$: Observable<Provider>;
  @Select(UserState.workshops) workshops$: Observable<WorkshopCard[]>;
  @Select(RegistrationState.role) role$: Observable<string>;

  data: Workshop | Provider;
  dataId: string;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    public navigationBarService: NavigationBarService,
    private actions$: Actions,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      takeUntil(this.destroy$))
      .subscribe(params => {
        this.dataId = params.id;
        this.router.url.includes(EntityType.workshop) ?
          this.getWorkshop() :
          this.getProvider();
      });

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  /**
  * This method get Workshop by Id, set ROutingParameters, set subscripbtion for rating action change;
  */
  private getWorkshop(): void {
    this.store.dispatch(new GetWorkshopById(this.dataId));

    this.workshop$.pipe(
      takeUntil(this.destroy$),
      filter((workshop: Workshop) => {
        if (!workshop) {
          this.setRouterParameters();
        }
        return !!workshop;
      })
    ).subscribe((workshop: Workshop) => this.getWorkshopData(workshop));

    this.actions$.pipe(ofAction(OnCreateRatingSuccess))
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged())
      .subscribe(() => this.store.dispatch(new GetWorkshopById(this.data.id)));
  }

  /**
   * This method get provider by Id
   */
  private getProvider(): void {
    this.store.dispatch(new GetProviderById(this.dataId));
    this.provider$.pipe(
      takeUntil(this.destroy$),
      filter((provider: Provider) => !!provider)
    ).subscribe((provider: Provider) => this.getProviderData(provider));
  }

  /**
  * This method detects if the workshop url was changed and navigatesl
  */
  private setRouterParameters(): void {
    let currentUrl = this.router.url;
    let previousUrl = null;

    previousUrl = currentUrl;
    currentUrl = this.router.url;

    (currentUrl !== previousUrl && previousUrl) ?
      this.router.navigate([previousUrl]) :
      this.location.back();
  }

  /**
  * This method get Workshop Data (provider, workshops, ratings) and set navigation path
  */
  private getWorkshopData(workshop: Workshop): void {
    this.data = workshop;
    this.store.dispatch(new GetProviderById(workshop.providerId));
    this.store.dispatch(new GetRateByEntityId(EntityType.workshop, workshop.id));
    this.getEntityData(workshop.providerId, this.store.selectSnapshot(UserState.selectedWorkshop).title);

  }
  /**
  * This method get Provider Data (provider, workshops, ratings) and set navigation path
  */
  private getProviderData(provider: Provider): void {
    this.data = provider;
    this.store.dispatch(new GetRateByEntityId(EntityType.provider, provider.id));
    this.getEntityData(provider.id, this.store.selectSnapshot(UserState.selectedProvider).fullTitle);
  }

  /**
  * This method get entityt data (provider Wworkshops and set navigation path);
  */
  getEntityData(providerId: string, title: string): void {
    this.store.dispatch(new GetWorkshopsByProviderId(providerId));
    this.store.dispatch(new AddNavPath(
      this.navigationBarService.creatNavPaths(
        { name: NavBarName.TopWorkshops, path: '/result', isActive: false, disable: false },
        { name: title, isActive: false, disable: true },
      )));
  }

  ngOnDestroy(): void {
    this.store.dispatch(new DeleteNavPath());
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
