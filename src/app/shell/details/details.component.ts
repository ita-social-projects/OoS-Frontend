import { combineLatest, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { WINDOW } from 'ngx-window-token';

import { Provider } from 'shared/models/provider.model';
import { Competition } from 'shared/models/competition.model';
import { Role } from 'shared/enum/role';
import { Workshop, WorkshopDraft } from 'shared/models/workshop.model';
import { NavigationBarService } from 'shared/services/navigation-bar/navigation-bar.service';
import { AppState } from 'shared/store/app.state';
import { DeleteNavPath } from 'shared/store/navigation.actions';
import { RegistrationState } from 'shared/store/registration.state';
import {
  GetCompetitionById,
  GetProviderById,
  GetWorkshopById,
  GetWorkshopDraftById,
  ResetProviderWorkshopDetails
} from 'shared/store/shared-user.actions';
import { SharedUserState } from 'shared/store/shared-user.state';
import { WorkshopType } from 'shared/enum/workshop';
import { Util } from 'shared/utils/utils';

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
  private workshop$: Observable<Workshop | WorkshopDraft>;
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

  public displayActionCard: boolean;

  protected readonly WorkshopType = WorkshopType;
  protected workshopType: WorkshopType;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    @Inject(WINDOW) private window: Window,
    private store: Store,
    private route: ActivatedRoute,
    public navigationBarService: NavigationBarService
  ) {}

  public ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params: Params) => {
      this.store.dispatch(new ResetProviderWorkshopDetails());
      this.workshopType = params.entity;
      this.getEntity(params.id);

      Util.scrollToTop(this.window);
    });

    this.setDataSubscription();
  }

  public ngOnDestroy(): void {
    this.store.dispatch([new DeleteNavPath(), new ResetProviderWorkshopDetails()]);
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private setDataSubscription(): void {
    combineLatest([this.isMobileScreen$, this.role$, this.workshop$, this.provider$, this.competition$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([isMobileScreen, role, workshop, provider, competition]) => {
        this.isMobileScreen = isMobileScreen;
        this.role = role;
        this.workshop = Util.containsWorkshopDetails(workshop)
          ? {
              draftStatus: workshop.draftStatus,
              rejectionMessage: workshop.rejectionMessage,
              workshopDraftId: workshop.workshopDraftId,
              ...workshop.workshopDetails
            }
          : workshop;
        this.provider = provider;
        this.competition = competition;
        this.displayActionCard = this.role === Role.parent || this.role === Role.unauthorized;
      });
  }

  /**
   * This method get Workshop or Provider by id;
   */
  private getEntity(id: string): void {
    switch (this.workshopType) {
      case WorkshopType.Workshop:
        this.store.dispatch(new GetWorkshopById(id));
        break;
      case WorkshopType.Draft:
        this.store.dispatch(new GetWorkshopDraftById(id));
        break;
      case WorkshopType.Competition:
        this.store.dispatch(new GetCompetitionById(id));
        break;
      default:
        this.store.dispatch(new GetProviderById(id));
        break;
    }
  }
}
