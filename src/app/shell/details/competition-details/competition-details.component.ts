import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { filter, Observable } from 'rxjs';
import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants, PaginationConstants } from 'shared/constants/constants';
import { CategoryIcons } from 'shared/enum/category-icons';
import { CompetitionDetailsTabTitlesParams, CompetitionStatus } from 'shared/enum/competition';
import { CompetitionDetailsTabTitlesEnum } from 'shared/enum/enumUA/competition';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { FormOfLearningEnum, RecruitmentStatusEnum } from 'shared/enum/enumUA/workshop';
import { InfoMenuType } from 'shared/enum/info-menu-type';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { Role } from 'shared/enum/role';
import { ImgPath } from 'shared/models/carousel.model';
import { Competition } from 'shared/models/competition.model';
import { Provider, ProviderParameters } from 'shared/models/provider.model';
import { ImagesService } from 'shared/services/images/images.service';
import { NavigationBarService } from 'shared/services/navigation-bar/navigation-bar.service';
import { AddNavPath } from 'shared/store/navigation.actions';
import { GetProviderById } from 'shared/store/shared-user.actions';
import { take } from 'rxjs/operators';
import { GetSubDirections } from 'shared/store/meta-data.actions';
import { MetaDataState } from 'shared/store/meta-data.state';
import { SubDirection } from 'shared/models/category.model';

@Component({
  selector: 'app-competition-details',
  templateUrl: './competition-details.component.html',
  styleUrls: ['./competition-details.component.scss']
})
export class CompetitionDetailsComponent implements OnInit {
  @Input() public competition: Competition;
  @Input() public provider: Provider;
  @Input() public role: Role;
  @Input() public isMobileScreen: boolean;
  @Input() public currentProvider: Provider;
  @Input() public displayActionCard: boolean;

  @Select(MetaDataState.subDirections) public subDirections$: Observable<SubDirection[]>;

  public readonly CategoryIcons = CategoryIcons;
  public readonly ModalType = ModalConfirmationType;
  public readonly CompetitionStatus = CompetitionStatus;
  public readonly RecruitmentStatusEnum = RecruitmentStatusEnum;
  public readonly FormOfLearningEnum = FormOfLearningEnum;
  public readonly CompetitionDetailsTabTitlesEnum = CompetitionDetailsTabTitlesEnum;
  public readonly InfoMenuType = InfoMenuType;

  public competitionStatusOpen: boolean;
  public images: ImgPath[] = [];
  public coverImage: string;
  public selectedIndex: number;
  public competitionSubdirections: string[];
  public providerParameters: ProviderParameters = {
    providerId: '',
    excludedCompetitionId: '',
    size: PaginationConstants.WORKSHOPS_PER_PAGE
  };

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly imageService: ImagesService,
    private readonly navigationBarService: NavigationBarService
  ) {}

  public ngOnInit(): void {
    this.providerParameters.excludedCompetitionId = this.competition.id;
    this.providerParameters.providerId = this.competition?.organizerOfTheEventId;
    this.getCompetitionData();
    this.getSubDirections();
    this.images = this.imageService.getCarouselImages(Object.setPrototypeOf(this.competition, Competition.prototype));
  }

  public onActionButtonClick(ModalType: ModalConfirmationType): void {
    const dialogRef = this.dialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalType
      }
    });
    dialogRef
      .afterClosed()
      .pipe(
        take(1),
        filter(Boolean)
        /*
         * todo: this code should be return when
         * backend add functions that archive/publish user Competition
         */
        // return this code when added feature for published competition
        // switchMap(() => {
        //   if (ModalType === this.ModalType.publishCompetition) {
        //     return this.store.dispatch(new PublishWorkshop(this.competition.organizerOfTheEventId));
        //   }
        // })
      )
      .subscribe();
  }

  public onTabChange(event: MatTabChangeEvent): void {
    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: { status: CompetitionDetailsTabTitlesParams[event.index] }
    });
  }

  private getCompetitionData(): void {
    this.coverImage = this.imageService.getCoverImage(this.competition);
    this.store.dispatch([
      new GetProviderById(this.competition.organizerOfTheEventId),
      new AddNavPath(
        this.navigationBarService.createNavPaths(
          {
            name: NavBarName.WorkshopResult,
            path: '/result',
            isActive: false,
            disable: false
          },
          { name: this.competition.title, isActive: false, disable: true }
        )
      )
    ]);
  }

  private getSubDirections(): void {
    this.subDirections$.pipe(filter(Boolean), take(1)).subscribe((subDirections: SubDirection[]) => {
      this.competitionSubdirections = subDirections.filter((sd) => this.competition.subDirectionIds.includes(sd.id)).map((sd) => sd.title);
    });

    this.store.dispatch(new GetSubDirections(this.competition.directionSubDirectionIds[0].directionId));
  }
}
