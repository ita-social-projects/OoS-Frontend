import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { filter, Observable, Subject, takeUntil } from 'rxjs';
import { Constants, ModeConstants, PaginationConstants } from 'shared/constants/constants';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { NoResultsTitle } from 'shared/enum/enumUA/no-results';
import { OwnershipTypesEnum } from 'shared/enum/enumUA/provider';
import { DraftStatusEnum, FormOfLearningEnum } from 'shared/enum/enumUA/workshop';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { OwnershipTypes } from 'shared/enum/provider';
import { UserStatusIcons } from 'shared/enum/statuses';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { SearchResponse } from 'shared/models/search.model';
import { ApproveCompetitionDraft, GetFilteredCompetitionDrafts, RejectCompetitionDraft } from 'shared/store/admin.actions';
import { PopNavPath, PushNavPath } from 'shared/store/navigation.actions';
import { Util } from 'shared/utils/utils';
import { WorkshopDraftStatus } from 'shared/enum/workshop';
import { Competition, CompetitionDraft, CompetitionFilterAdministration } from 'shared/models/competition.model';
import { AdminState } from 'shared/store/admin.state';
import { ReasonModalWindowComponent } from 'shared/components/confirmation-modal-window/reason-modal-window/reason-modal-window.component';

@Component({
  selector: 'app-admin-competition-list',
  templateUrl: './admin-competition-list.component.html',
  styleUrls: ['./admin-competition-list.component.scss']
})
export class AdminCompetitionListComponent implements OnInit, OnDestroy {
  @Select(AdminState.competitionDrafts)
  public competitionDrafts$: Observable<SearchResponse<CompetitionDraft[]>>;

  public readonly noWorkshops = NoResultsTitle.noResult;
  public readonly modeConstants = ModeConstants;
  public readonly tooltipPosition = Constants.MAT_TOOL_TIP_POSITION_BELOW;
  public readonly ownershipTypeEnum = OwnershipTypesEnum;
  public readonly formOfLearningEnum = FormOfLearningEnum;
  public readonly ownershipTypes = OwnershipTypes;
  public readonly statusIcons = UserStatusIcons;
  public readonly UNLIMITED_SEATS = Constants.UNLIMITED_SEATS;
  public readonly workshopDraftStatus = WorkshopDraftStatus;
  public readonly workshopDraftStatusTitles = DraftStatusEnum;
  public readonly displayedColumns: string[] = [
    'title',
    'providerEdrpou',
    'directorPosition',
    'directorFullName',
    'isPaid',
    'status',
    'actions'
  ];
  public competitionParameters: CompetitionFilterAdministration = {};
  public dataSource = new MatTableDataSource<CompetitionDraft>();
  public currentPage: PaginationElement = PaginationConstants.firstPage;

  public competition: Competition;
  public selectedCompetitionDraftId: string;
  public isInfoDisplayed: boolean;
  public totalEntities: number;

  private readonly destroy$: Subject<void> = new Subject<void>();

  constructor(
    protected readonly route: ActivatedRoute,
    private readonly store: Store,
    private readonly matDialog: MatDialog
  ) {}

  @Input()
  public set competitions(value: SearchResponse<CompetitionDraft[]>) {
    this.dataSource.data = value?.entities;
    this.totalEntities = value?.totalAmount;
  }

  public ngOnInit(): void {
    this.store.dispatch(
      new PushNavPath({
        name: NavBarName.CompetitionDrafts,
        isActive: false,
        disable: true
      })
    );
    this.competitionDrafts$.pipe(filter(Boolean), takeUntil(this.destroy$)).subscribe((competitions) => {
      this.competitions = competitions;
    });
  }

  public onViewCompetitionInfo(competition: CompetitionDraft): void {
    this.selectedCompetitionDraftId = competition.competitiveEventDraftId;
    this.competition = competition.competitiveEventDetails;
    this.isInfoDisplayed = true;
  }

  public onRejectDraft(competition: CompetitionDraft): void {
    const dialogRef = this.matDialog.open(ReasonModalWindowComponent, {
      data: { type: ModalConfirmationType.editingCompetition }
    });
    dialogRef
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe((statusReason: string) =>
        this.store.dispatch(new RejectCompetitionDraft(competition.competitiveEventDraftId, statusReason))
      );
  }

  public onApproveDraft(competition: CompetitionDraft): void {
    this.store.dispatch(new ApproveCompetitionDraft(competition.competitiveEventDraftId));
  }

  public onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.getCompetitions();
  }

  public onItemsPerPageChange(itemsPerPage: number): void {
    this.competitionParameters.size = itemsPerPage;
    this.onPageChange(PaginationConstants.firstPage);
  }

  public closeInfo(): void {
    this.isInfoDisplayed = false;
    this.selectedCompetitionDraftId = null;
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
    this.store.dispatch(new PopNavPath());
  }

  public getCompetitions(filterData: { parameters: CompetitionFilterAdministration; currentPage: PaginationElement } = null): void {
    if (filterData?.parameters && filterData?.currentPage) {
      this.competitionParameters = filterData.parameters;
      this.currentPage = filterData.currentPage;
    }

    Util.setFromPaginationParam(this.competitionParameters, this.currentPage, this.totalEntities);
    this.store.dispatch(new GetFilteredCompetitionDrafts(this.competitionParameters));
  }
}
