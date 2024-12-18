import { combineLatest, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Select, Store } from '@ngxs/store';

import { Provider } from 'shared/models/provider.model';
import { Role } from '../../shared/enum/role';
import { Workshop } from '../../shared/models/workshop.model';
import { NavigationBarService } from '../../shared/services/navigation-bar/navigation-bar.service';
import { AppState } from '../../shared/store/app.state';
import { DeleteNavPath } from '../../shared/store/navigation.actions';
import { RegistrationState } from '../../shared/store/registration.state';
import { GetProviderById, GetWorkshopById, ResetProviderWorkshopDetails } from '../../shared/store/shared-user.actions';
import { SharedUserState } from '../../shared/store/shared-user.state';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {
  @Select(AppState.isMobileScreen)
  private isMobileScreen$: Observable<boolean>;
  @Select(SharedUserState.selectedWorkshop)
  private workshop$: Observable<Workshop>;
  @Select(SharedUserState.selectedProvider)
  private provider$: Observable<Provider>;
  @Select(RegistrationState.role)
  private role$: Observable<Role>;

  public isMobileScreen: boolean;
  public workshop: Workshop;
  public provider: Provider;
  public role: Role;

  public isWorkshop = false;
  public displayActionCard: boolean;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    public navigationBarService: NavigationBarService
  ) {}

  public ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params: Params) => {
      this.store.dispatch(new ResetProviderWorkshopDetails());
      this.isWorkshop = params.entity === 'workshop';

      this.getEntity(params.id);

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    this.setDataSubscribtion();
  }

  public ngOnDestroy(): void {
    this.store.dispatch([new DeleteNavPath(), new ResetProviderWorkshopDetails()]);
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
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
    if (this.isWorkshop) {
      this.store.dispatch(new GetWorkshopById(id));
    } else {
      this.store.dispatch(new GetProviderById(id));
    }
  }
}
