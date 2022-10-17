import { Component, Input, OnInit, OnDestroy, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Actions, Store, ofActionCompleted } from '@ngxs/store';
import { Observable, of, Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ApplicationStatus } from 'src/app/shared/enum/applications';
import { ApplicationTitles } from 'src/app/shared/enum/enumUA/applications';
import { ApplicationParameters } from 'src/app/shared/models/application.model';
import { CategoryIcons } from '../../../shared/enum/category-icons';
import { RecruitmentStatusUkr, WorkshopTitles, WorkshopTitlesReverse } from '../../../shared/enum/enumUA/workshop';
import { NavBarName } from '../../../shared/enum/navigation-bar';
import { Role, EntityType } from '../../../shared/enum/role';
import { WorkshopOpenStatus, WorkshopStatus } from '../../../shared/enum/workshop';
import { ImgPath } from '../../../shared/models/carousel.model';
import { Provider } from '../../../shared/models/provider.model';
import { Workshop } from '../../../shared/models/workshop.model';
import { ImagesService } from '../../../shared/services/images/images.service';
import { NavigationBarService } from '../../../shared/services/navigation-bar/navigation-bar.service';
import { GetRateByEntityId } from '../../../shared/store/meta-data.actions';
import { AddNavPath } from '../../../shared/store/navigation.actions';
import { OnCreateRatingSuccess } from '../../../shared/store/parent.actions';
import { ResetAchievements } from '../../../shared/store/provider.actions';
import { GetWorkshopById, GetProviderById, GetWorkshopsByProviderId } from '../../../shared/store/shared-user.actions';

@Component({
  selector: 'app-workshop-details',
  templateUrl: './workshop-details.component.html',
  styleUrls: ['./workshop-details.component.scss'],
})
export class WorkshopDetailsComponent implements OnInit, OnDestroy {
  readonly categoryIcons = CategoryIcons;
  readonly recruitmentStatusUkr = RecruitmentStatusUkr;
  readonly workshopStatus = WorkshopOpenStatus;
  
  readonly workshopTitles = WorkshopTitles;

  // @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  
  @Input() role: Role;
  @Input() workshop: Workshop;
  @Input() provider: Provider;
  @Input() isMobileScreen: boolean;
  @Input() displayActionCard: boolean;

  workshopStatusOpen: boolean;
  selectedIndex: number;
  tabIndex: number;
  destroy$: Subject<boolean> = new Subject<boolean>();
  images: ImgPath[] = [];
  routerOutletNavService: any;
  activatedRoute: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private imagesService: ImagesService,
    private actions$: Actions,
    private store: Store,
    private navigationBarService: NavigationBarService
  ) {this.route.queryParams
    .pipe(takeUntil(this.destroy$))
    .subscribe((params: Params) => {
      this.tabIndex = Object.keys(WorkshopTitles).indexOf(params['status']);
    });}

  ngOnInit(): void {

    this.getWorkshopData();

    this.workshopStatusOpen = this.workshop.status === this.workshopStatus.Open;

    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(() => (this.selectedIndex = 0));
    this.actions$
      .pipe(ofActionCompleted(OnCreateRatingSuccess))
      .pipe(takeUntil(this.destroy$), distinctUntilChanged())
      .subscribe(() => this.store.dispatch(new GetWorkshopById(this.workshop.id)));
  }

  private getWorkshopData(): void {
    this.images = this.imagesService.setCarouselImages(this.workshop);
    this.store.dispatch([
      new GetProviderById(this.workshop.providerId),
      new GetRateByEntityId(EntityType.workshop, this.workshop.id),
      new GetWorkshopsByProviderId(this.workshop.providerId, this.workshop.id),
      new AddNavPath(
        this.navigationBarService.createNavPaths(
          {
            name: NavBarName.WorkshopResult,
            path: '/result',
            isActive: false,
            disable: false,
          },
          { name: this.workshop.title, isActive: false, disable: true }
        )
      ),
    ]);
  }

  onTabChange(event: MatTabChangeEvent): void {
    const tabLabel = event.tab.textLabel;
    // return WorkshopTitlesReverse[tabLabel]
    // this.router.navigate(['./'], { relativeTo: this.route, queryParams: { status: WorkshopTitlesReverse[tabLabel] } });
    this.router.navigate([`./details/workshop/${this.workshop.id}/${WorkshopTitlesReverse[tabLabel]}`]);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(new ResetAchievements());
  }
}
