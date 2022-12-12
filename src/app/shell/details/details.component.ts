import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, Provider } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, combineLatest } from 'rxjs';
import { EntityType, Role } from '../../shared/enum/role';
import { Workshop } from '../../shared/models/workshop.model';
import { NavigationBarService } from '../../shared/services/navigation-bar/navigation-bar.service';
import { AppState } from '../../shared/store/app.state';
import { DeleteNavPath } from '../../shared/store/navigation.actions';
import { RegistrationState } from '../../shared/store/registration.state';
import { ResetProviderWorkshopDetails, GetWorkshopById, GetProviderById } from '../../shared/store/shared-user.actions';
import { SharedUserState } from '../../shared/store/shared-user.state';
import { OnPageChangeWorkshops } from '../../shared/store/paginator.actions';
import { PaginationConstants } from '../../shared/constants/constants';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit, OnDestroy {
  readonly entityType = EntityType;

  @Select(AppState.isMobileScreen)
  isMobileScreen$: Observable<boolean>;
  isMobileScreen: boolean;

  @Select(SharedUserState.selectedWorkshop)
  workshop$: Observable<Workshop>;
  workshop: Workshop;

  @Select(SharedUserState.selectedProvider)
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
    public navigationBarService: NavigationBarService
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params: Params) => {
      this.store.dispatch(new ResetProviderWorkshopDetails());
      this.entity = params.entity;

      this.getEntity(params.id);

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });

    this.setDataSubscribtion();
  }

  private setDataSubscribtion(): void {
    combineLatest([this.isMobileScreen$, this.role$, this.workshop$, this.provider$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([isMobileScreen, role, workshop, provider]) => {
        this.isMobileScreen = isMobileScreen;
        this.role = role;
        this.workshop = workshop;
        this.provider = provider;

        this.displayActionCard = this.role === Role.parent || this.role === Role.unauthorized;
      });
  }

  /**
   * This method get Workshop or Provider by Id;
   */
  private getEntity(id: string): void {
    this.entity === EntityType.workshop
      ? this.store.dispatch(new GetWorkshopById(id))
      : this.store.dispatch(new GetProviderById(id));
  }

  ngOnDestroy(): void {
    this.store.dispatch([new DeleteNavPath(), new OnPageChangeWorkshops(PaginationConstants.firstPage)]);
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
