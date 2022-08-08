import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, combineLatest } from 'rxjs';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { DeleteNavPath } from 'src/app/shared/store/navigation.actions';
import { GetProviderById, GetWorkshopById, ResetProviderWorkshopDetails } from 'src/app/shared/store/user.actions';
import { UserState } from 'src/app/shared/store/user.state';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { Provider } from 'src/app/shared/models/provider.model';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { AppState } from 'src/app/shared/store/app.state';
import { EntityType, Role } from 'src/app/shared/enum/role';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {
  readonly entityType = EntityType;

  @Select(AppState.isMobileScreen) 
  isMobileScreen$: Observable<boolean>;
  isMobileScreen: boolean;
  
  @Select(UserState.selectedWorkshop) 
  workshop$: Observable<Workshop>;
  workshop: Workshop;

  @Select(UserState.selectedProvider) 
  provider$: Observable<Provider>;
  provider: Provider;

  @Select(RegistrationState.role) 
  role$: Observable<Role>;
  role: Role;

  entity: EntityType;
  destroy$: Subject<boolean> = new Subject<boolean>();
  displayActionCard: boolean;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    public navigationBarService: NavigationBarService,
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      takeUntil(this.destroy$))
      .subscribe((params : Params) => {
        this.store.dispatch(new ResetProviderWorkshopDetails());
        this.entity = this.router.url.includes(EntityType.workshop) ?
          EntityType.workshop :
          EntityType.provider;

        this.getEntity(params.id);

        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });

    this.setDataSubscribtion();
  }

  private setDataSubscribtion(): void {
    combineLatest([this.isMobileScreen$, this.role$, this.workshop$, this.provider$]) 
        .pipe(takeUntil(this.destroy$))
        .subscribe(([isMobileScreen, role, workshop, provider])=> {
          this.isMobileScreen = isMobileScreen;
          this.role = role;
          this.workshop = workshop;
          this.provider = provider;

          this.displayActionCard = (this.role === Role.parent || this.role ===  Role.unauthorized);
        });
  }

  /**
  * This method get Workshop or Provider by Id;
  */
  private getEntity(id: string): void {
    this.entity === EntityType.workshop ?
      this.store.dispatch(new GetWorkshopById(id)) :
      this.store.dispatch(new GetProviderById(id));
  }

  ngOnDestroy(): void {
    this.store.dispatch(new DeleteNavPath());
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
