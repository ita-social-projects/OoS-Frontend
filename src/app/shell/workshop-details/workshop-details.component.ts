import { distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
import { User } from 'src/app/shared/models/user.model';
import { Role } from 'src/app/shared/enum/role';
@Component({
  selector: 'app-workshop-details',
  templateUrl: './workshop-details.component.html',
  styleUrls: ['./workshop-details.component.scss']
})
export class WorkshopDetailsComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  @Select(UserState.selectedWorkshop) workshop$: Observable<Workshop>;
  @Select(UserState.selectedProvider) provider$: Observable<Provider>;
  @Select(UserState.workshops) workshops$: Observable<WorkshopCard[]>;
  @Select(RegistrationState.user) user$: Observable<User>;
  user: User;
  isRegistered = false;
  isDisplayedforProvider = false;
  workshopId: number;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    public navigationBarService: NavigationBarService,
    private actions$: Actions,
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      takeUntil(this.destroy$))
      .subscribe(params => {
        this.store.dispatch(new GetWorkshopById(+params.id));
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });

    this.workshop$.pipe(
      filter((workshop: Workshop) => !!workshop),
      takeUntil(this.destroy$)
    ).subscribe((workshop: Workshop) => {
      this.store.dispatch(new GetProviderById(workshop.providerId));
      this.store.dispatch(new GetWorkshopsByProviderId(workshop.providerId));
      this.store.dispatch(new AddNavPath(this.navigationBarService.creatNavPaths(
        { name: NavBarName.TopWorkshops, path: '/result', isActive: false, disable: false },
        { name: this.store.selectSnapshot(UserState.selectedWorkshop).title, isActive: false, disable: true },
      )));
    });

    this.setUserView();

    this.actions$.pipe(ofAction(OnCreateRatingSuccess))
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged())
      .subscribe(() => this.store.dispatch(new GetWorkshopById(this.workshopId)));
  }

  private setUserView(): void {
    this.user$.subscribe((user: User) => this.user = user);
    this.isRegistered = Boolean(this.user);
    this.isDisplayedforProvider = (this.user?.role !== Role.provider);
  }

  ngOnDestroy(): void {
    this.store.dispatch(new DeleteNavPath());
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
