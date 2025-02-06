import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { filter, switchMap } from 'rxjs';
import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants, PaginationConstants } from 'shared/constants/constants';
import { CategoryIcons } from 'shared/enum/category-icons';
import { CompetitionDetailsTabTitlesParams, CompetitionStatus } from 'shared/enum/competition';
import { CompetitionDetailsTabTitlesEnum } from 'shared/enum/enumUA/competition';
import { FormOfLearningEnum, RecruitmentStatusEnum } from 'shared/enum/enumUA/workshop';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { Role } from 'shared/enum/role';
import { ImgPath } from 'shared/models/carousel.model';
import { Competition } from 'shared/models/competition.model';
import { Provider, ProviderParameters } from 'shared/models/provider.model';
import { ImagesService } from 'shared/services/images/images.service';

@Component({
  selector: 'app-competition-details',
  templateUrl: './competition-details.component.html',
  styleUrls: ['./competition-details.component.scss']
})
export class CompetitionDetailsComponent implements OnInit {
  @Input()
  public competition: Competition;
  @Input()
  public provider: Provider;
  @Input()
  public role: Role;
  @Input()
  public isMobileScreen: boolean;
  @Input()
  public currentProvider: Provider;

  public readonly categoryIcons = CategoryIcons;
  public readonly modalType = ModalConfirmationType;
  public readonly competitionStatus = CompetitionStatus;
  public readonly recruitmentStatusEnum = RecruitmentStatusEnum;
  public readonly FormOfLearningEnum = FormOfLearningEnum;
  public readonly competitionTitles = CompetitionDetailsTabTitlesEnum;

  public competitionStatusOpen: boolean;
  public images: ImgPath[] = [];
  public selectedIndex: number;
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
    private readonly imageService: ImagesService
  ) {}

  public ngOnInit(): void {
    this.competition.directionIds = [1];
    this.providerParameters.excludedCompetitionId = this.competition.id;
    this.providerParameters.providerId = this.competition?.organizerOfTheEventId;
    this.images = this.imageService.setCarouselImages(this.competition);
  }

  public onActionButtonClick(modalType: ModalConfirmationType): void {
    const dialogRef = this.dialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: modalType
      }
    });
    dialogRef
      .afterClosed()
      .pipe(
        filter(Boolean)
        // return this code when added feature for published competition
        // switchMap(() => {
        //   if (modalType === this.modalType.publishCompetition) {
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
}
