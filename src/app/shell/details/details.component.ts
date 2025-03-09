import { combineLatest, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Select, Store } from '@ngxs/store';

import { Provider } from 'shared/models/provider.model';
import { Competition } from 'shared/models/competition.model';
import { Role } from '../../shared/enum/role';
import { Workshop, WorkshopDraft } from '../../shared/models/workshop.model';
import { NavigationBarService } from '../../shared/services/navigation-bar/navigation-bar.service';
import { GetCompetitionById } from '../../shared/store/shared-user.actions';
import { Role } from 'shared/enum/role';
import { Workshop, WorkshopDraft } from 'shared/models/workshop.model';
import { NavigationBarService } from 'shared/services/navigation-bar/navigation-bar.service';
import { AppState } from 'shared/store/app.state';
import { DeleteNavPath } from 'shared/store/navigation.actions';
import { RegistrationState } from 'shared/store/registration.state';
import { GetProviderById, GetWorkshopById, GetWorkshopDraftById, ResetProviderWorkshopDetails } from 'shared/store/shared-user.actions';
import { SharedUserState } from 'shared/store/shared-user.state';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {
  @Select(RegistrationState.provider)
  public currentProvider$: Observable<Provider>;
  @Select(AppState.isMobileScreen)
  private isMobileScreen$: Observable<boolean>;
  @Select(SharedUserState.selectedWorkshop)
  private workshop$: Observable<Workshop>;
  @Select(SharedUserState.selectedDraft)
  private workshopDraft$: Observable<Workshop>;
  @Select(SharedUserState.selectedProvider)
  private provider$: Observable<Provider>;
  @Select(SharedUserState.selectedCompetition)
  private competition$: Observable<Competition>;
  @Select(RegistrationState.role)
  private role$: Observable<Role>;

  public isMobileScreen: boolean;
  public workshop: Workshop | WorkshopDraft;
  public provider: Provider;
  public competition: Competition;
  public role: Role;

  public isWorkshop = false;
  public isDraft = false;
  public isCompetition = false;
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
      this.isDraft = params.entity === 'draft';
      this.isCompetition = params.entity === 'competition';

      this.getEntity(params.id);

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    this.setDataSubscription();
  }

  public ngOnDestroy(): void {
    this.store.dispatch([new DeleteNavPath(), new ResetProviderWorkshopDetails()]);
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private setDataSubscription(): void {
    const workshopSource = this.isWorkshop ? this.workshop$ : this.workshopDraft$;

    combineLatest([this.isMobileScreen$, this.role$, workshopSource, this.provider$, this.competition$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([isMobileScreen, role, workshop, provider, competition]) => {
        this.isMobileScreen = isMobileScreen;
        this.role = role;
        this.workshop = workshop;
        this.provider = provider;
        this.competition = competition;
        this.displayActionCard = this.role === Role.parent || this.role === Role.unauthorized;
      });
  }

  /**
   * This method get Workshop or Provider by Id;
   */
  private getEntity(id: string): void {
    if (this.isWorkshop) {
      if (this.isWorkshop) {
        this.store.dispatch(new GetWorkshopById(id));
      } else if (this.isDraft) {
        this.store.dispatch(new GetWorkshopDraftById(id));
      }
    } else if (this.isCompetition) {
      this.store.dispatch(new GetCompetitionById(id));
    } else {
      this.store.dispatch(new GetProviderById(id));
    }
  }
}
