import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, ofAction, Select, Store } from '@ngxs/store';
import { WINDOW } from 'ngx-window-token';
import { EMPTY, filter, Observable } from 'rxjs';
import { switchMap, take, takeUntil, tap } from 'rxjs/operators';

import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants, PaginationConstants } from 'shared/constants/constants';
import { CompetitionStatus } from 'shared/enum/competition';
import { CompetitionDetailsTabTitlesEnum } from 'shared/enum/enumUA/competition';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { FormOfLearningEnum, RecruitmentStatusEnum } from 'shared/enum/enumUA/workshop';
import { InfoMenuType } from 'shared/enum/info-menu-type';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { Role } from 'shared/enum/role';
import { Competition, CompetitionDraft } from 'shared/models/competition.model';
import { ImgPath } from 'shared/models/carousel.model';
import { Provider, ProviderParameters } from 'shared/models/provider.model';
import { ImagesService } from 'shared/services/images/images.service';
import { NavigationBarService } from 'shared/services/navigation-bar/navigation-bar.service';
import { AddNavPath } from 'shared/store/navigation.actions';
import { GetCompetitionById, GetCompetitionDraftById, GetProviderById } from 'shared/store/shared-user.actions';
import { GetSubDirections } from 'shared/store/meta-data.actions';
import { MetaDataState } from 'shared/store/meta-data.state';
import { SubDirection } from 'shared/models/category.model';
import {
  ArchiveCompetitionById,
  CompetitionDraftSendForModeration,
  GetCompetitionDraftIdByCompetitionId,
  OnArchiveCompetitionFail,
  OnArchiveCompetitionSuccess,
  OnDraftSendForModerationSuccess
} from 'shared/store/provider.actions';
import { WorkshopDraftStatus, WorkshopType } from 'shared/enum/workshop';
import { TabParamsComponent } from '../details-tabs/tab-params.component';

@Component({
  selector: 'app-competition-details',
  templateUrl: './competition-details.component.html',
  styleUrls: ['./competition-details.component.scss']
})
export class CompetitionDetailsComponent extends TabParamsComponent implements OnInit {
  @Input() public competition: Competition | CompetitionDraft;
  @Input() public provider: Provider;
  @Input() public role: Role;
  @Input() public isMobileScreen: boolean;
  @Input() public currentProvider: Provider;
  @Input() public displayActionCard: boolean;

  @Select(MetaDataState.subDirections) public subDirections$: Observable<SubDirection[]>;

  public readonly ModalType = ModalConfirmationType;
  public readonly CompetitionStatus = CompetitionStatus;
  public readonly RecruitmentStatusEnum = RecruitmentStatusEnum;
  public readonly FormOfLearningEnum = FormOfLearningEnum;
  public readonly CompetitionDetailsTabTitlesEnum = CompetitionDetailsTabTitlesEnum;
  public readonly InfoMenuType = InfoMenuType;
  public readonly WorkshopDraftStatus = WorkshopDraftStatus;

  public isImageBroken: boolean = false;
  public competitionStatusOpen: boolean;
  public images: ImgPath[] = [];
  public coverImage: string;
  public competitionSubdirections: string[];
  public providerParameters: ProviderParameters = {
    providerId: '',
    excludedCompetitionId: '',
    size: PaginationConstants.WORKSHOPS_PER_PAGE
  };

  constructor(
    @Inject(WINDOW) protected window: Window,
    protected readonly route: ActivatedRoute,
    protected readonly router: Router,
    private readonly store: Store,
    private readonly dialog: MatDialog,
    private readonly imagesService: ImagesService,
    private readonly navigationBarService: NavigationBarService,
    private readonly actions$: Actions
  ) {
    super(window, route, router);
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.providerParameters.excludedCompetitionId = this.competition.id ? this.competition.id : '';
    this.providerParameters.providerId = this.competition.organizerOfTheEventId;
    this.getCompetitionData();
    this.getSubDirections();
  }

  public onActionButtonClick(type: ModalConfirmationType): void {
    const dialogRef = this.dialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type
      }
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(() => {
          if (type === ModalConfirmationType.draftSet) {
            this.store.dispatch(new CompetitionDraftSendForModeration((this.competition as CompetitionDraft).competitiveEventDraftId));

            return this.actions$.pipe(
              ofAction(OnDraftSendForModerationSuccess),
              take(1),
              takeUntil(this.actions$.pipe(ofAction(OnArchiveCompetitionFail))),
              tap(() => this.store.dispatch(new GetCompetitionDraftById((this.competition as CompetitionDraft).competitiveEventDraftId)))
            );
          }

          if (type === ModalConfirmationType.archiveCompetition) {
            this.store.dispatch(new ArchiveCompetitionById(this.competition.id));
            return this.actions$.pipe(
              ofAction(OnArchiveCompetitionSuccess),
              take(1),
              takeUntil(this.actions$.pipe(ofAction(OnArchiveCompetitionFail))),
              tap(() => this.store.dispatch(new GetCompetitionById((this.competition as Competition).id)))
            );
          }

          return EMPTY;
        })
      )
      .subscribe();
  }

  public onEdit(): void {
    const competitionId = this.route.snapshot.paramMap.get('id');
    if (this.route.snapshot.paramMap.get('entity') === WorkshopType.CompetitionDraft) {
      this.router.navigate(['/create/competition/draft', competitionId]);
    } else {
      this.store.dispatch(new GetCompetitionDraftIdByCompetitionId(competitionId));
    }
  }

  public onImageError(): void {
    this.isImageBroken = true;
    this.coverImage = this.imagesService.getDefaultCoverImage();
  }

  protected initTabs(): void {
    this.tabs = [
      {
        alias: 'AboutCompetition',
        labelKey: this.CompetitionDetailsTabTitlesEnum.AboutCompetition,
        visible: true
      },
      {
        alias: 'Judges',
        labelKey: this.CompetitionDetailsTabTitlesEnum.Judges,
        visible: true
      },
      {
        alias: 'Contacts',
        labelKey: this.CompetitionDetailsTabTitlesEnum.Contacts,
        visible: true
      },
      {
        alias: 'Images',
        labelKey: this.CompetitionDetailsTabTitlesEnum.Images,
        visible: true
      }
    ].filter((tab) => tab.visible);
  }

  private getCompetitionData(): void {
    this.coverImage = this.imagesService.getCoverImage(this.competition);
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
    if (this.competition.directionSubDirectionIds?.at(0)) {
      this.store.dispatch(new GetSubDirections(String(this.competition.directionSubDirectionIds.at(0).directionId)));

      this.subDirections$.pipe(filter(Boolean), take(1)).subscribe((subDirections: SubDirection[]) => {
        this.competitionSubdirections = subDirections
          .filter((sd) => this.competition?.subDirectionIds.includes(sd.id))
          .map((sd) => sd.title);
      });
    }
  }
}
