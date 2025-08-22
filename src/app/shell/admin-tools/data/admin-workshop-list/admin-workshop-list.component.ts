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
import { Codeficator } from 'shared/models/codeficator.model';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { SearchResponse } from 'shared/models/search.model';
import { Workshop, WorkshopDraft, WorkshopFilterAdministration } from 'shared/models/workshop.model';
import { ApproveWorkshopDraft, GetFilteredWorkshopDrafts, RejectWorkshopDraft } from 'shared/store/admin.actions';
import { PopNavPath, PushNavPath } from 'shared/store/navigation.actions';
import { Util } from 'shared/utils/utils';
import { WorkshopDraftStatus } from 'shared/enum/workshop';
import { AdminState } from 'shared/store/admin.state';
import { ReasonModalWindowComponent } from 'shared/components/confirmation-modal-window/reason-modal-window/reason-modal-window.component';

@Component({
  selector: 'app-workshop-list',
  templateUrl: './admin-workshop-list.component.html',
  styleUrls: ['./admin-workshop-list.component.scss']
})
export class AdminWorkshopListComponent implements OnInit, OnDestroy {
  @Select(AdminState.workshopDrafts)
  public workshopDrafts$: Observable<SearchResponse<WorkshopDraft[]>>;

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
  public readonly workshopStatusesToFilter = ['PendingModeration', 'EditedByModerator'];
  public readonly displayedColumns: string[] = [
    'title',
    'providerTitle',
    'providerOwnership',
    // 'formOfLearning',
    // 'seats',
    'providerEdrpou',
    'directorPosition',
    'directorFullName',
    'isPaid',
    'status',
    'actions'
  ];
  public workshopParameters: WorkshopFilterAdministration = {};
  public dataSource = new MatTableDataSource<WorkshopDraft>();
  public currentPage: PaginationElement = PaginationConstants.firstPage;
  public workshop: Workshop;
  public selectedWorkshopDraftId: string;
  public isInfoDisplayed: boolean;
  public totalEntities: number;

  private readonly destroy$: Subject<void> = new Subject<void>();

  constructor(
    protected readonly route: ActivatedRoute,
    private readonly store: Store,
    private readonly matDialog: MatDialog
  ) {}

  @Input()
  public set workshops(value: SearchResponse<WorkshopDraft[]>) {
    this.dataSource.data = value?.entities;
    this.totalEntities = value?.totalAmount;
  }

  public compareCodeficators(codeficator1: Codeficator, codeficator2: Codeficator): boolean {
    return codeficator1.id === codeficator2.id;
  }

  public ngOnInit(): void {
    this.store.dispatch(
      new PushNavPath({
        name: NavBarName.WorkshopDrafts,
        isActive: false,
        disable: true
      })
    );

    this.workshopDrafts$.pipe(filter(Boolean), takeUntil(this.destroy$)).subscribe((workshops: SearchResponse<WorkshopDraft[]>) => {
      this.workshops = workshops;
    });
  }

  public onViewWorkshopInfo(workshop: WorkshopDraft): void {
    this.selectedWorkshopDraftId = workshop.workshopDraftId;
    this.workshop = workshop.workshopDetails;
    this.isInfoDisplayed = true;
  }

  public onRejectDraft(workshop: WorkshopDraft): void {
    const dialogRef = this.matDialog.open(ReasonModalWindowComponent, {
      data: { type: ModalConfirmationType.editingWorkshop }
    });
    dialogRef
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe((statusReason: string) => this.store.dispatch(new RejectWorkshopDraft(workshop.workshopDraftId, statusReason)));
  }

  public onApproveDraft(workshop: WorkshopDraft): void {
    this.store.dispatch(new ApproveWorkshopDraft(workshop.workshopDraftId));
  }

  public onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.getWorkshops();
  }

  public onItemsPerPageChange(itemsPerPage: number): void {
    this.workshopParameters.size = itemsPerPage;
    this.onPageChange(PaginationConstants.firstPage);
  }

  public closeInfo(): void {
    this.isInfoDisplayed = false;
    this.selectedWorkshopDraftId = null;
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
    this.store.dispatch(new PopNavPath());
  }

  public getWorkshops(filterData: { parameters: WorkshopFilterAdministration; currentPage: PaginationElement } = null): void {
    if (filterData?.parameters && filterData?.currentPage) {
      this.workshopParameters = filterData.parameters;
      this.currentPage = filterData.currentPage;
    }
    Util.setFromPaginationParam(this.workshopParameters, this.currentPage, this.totalEntities);
    this.store.dispatch(new GetFilteredWorkshopDrafts(this.workshopParameters));
  }
}
