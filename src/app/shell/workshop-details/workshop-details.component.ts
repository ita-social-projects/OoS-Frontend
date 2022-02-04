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

@Component({
  selector: 'app-workshop-details',
  templateUrl: './workshop-details.component.html',
  styleUrls: ['./workshop-details.component.scss']
})
export class WorkshopDetailsComponent implements OnInit, OnDestroy {

  @Select(AppState.isMobileScreen) isMobileScreen$: Observable<boolean>;
  @Select(UserState.selectedWorkshop) workshop$: Observable<Workshop>;
  @Select(UserState.selectedProvider) provider$: Observable<Provider>;
  @Select(UserState.workshops) workshops$: Observable<WorkshopCard[]>;
  @Select(RegistrationState.role) role$: Observable<string>;
  destroy$: Subject<boolean> = new Subject<boolean>();

  workshop: Workshop;
  ratings: Rate[];
  workshopId: string;
  previousUrl: string;
  currentUrl: string;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    public navigationBarService: NavigationBarService,
    private actions$: Actions,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    this.previousUrl = null;
    
    this.route.params.pipe(
      takeUntil(this.destroy$))
      .subscribe(params => {
        this.previousUrl = this.currentUrl;
        this.currentUrl = this.router.url;
        this.store.dispatch(new GetWorkshopById(params.id)).subscribe(() => {
          this.workshop$.pipe(
            filter((workshop: Workshop) => {
              if (workshop) {
                return true;
              } else {
                if (this.currentUrl !== this.previousUrl && this.previousUrl) {
                  this.router.navigate([this.previousUrl]);
                } else {
                  this.location.back();
                }
                return false;
              }
            }),
            takeUntil(this.destroy$)
          ).subscribe((workshop: Workshop) => {
            this.workshop = workshop;
            this.workshopId = workshop.id;
            this.store.dispatch(new GetProviderById(workshop.providerId));
            this.store.dispatch(new GetWorkshopsByProviderId(workshop.providerId));
            this.store.dispatch(new AddNavPath(this.navigationBarService.creatNavPaths(
              { name: NavBarName.TopWorkshops, path: '/result', isActive: false, disable: false },
              { name: this.store.selectSnapshot(UserState.selectedWorkshop).title, isActive: false, disable: true },
            )));
          });
        })
        this.store.dispatch(new GetRateByEntityId('workshop', params.id));
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });

    this.actions$.pipe(ofAction(OnCreateRatingSuccess))
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged())
      .subscribe(() => this.store.dispatch(new GetWorkshopById(this.workshop.id)));

  }

  ngOnDestroy(): void {
    this.store.dispatch(new DeleteNavPath());
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
