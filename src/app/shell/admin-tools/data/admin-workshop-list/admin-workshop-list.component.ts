import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Select, Store } from '@ngxs/store';
import { BehaviorSubject, filter, Observable, Subject, takeUntil } from 'rxjs';
import { Constants, PaginationConstants } from 'shared/constants/constants';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { NoResultsTitle } from 'shared/enum/enumUA/no-results';
import { OwnershipTypesEnum } from 'shared/enum/enumUA/provider';
import { DraftStatusEnum, FormOfLearningEnum } from 'shared/enum/enumUA/workshop';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { OwnershipTypes } from 'shared/enum/provider';
import { UserStatusIcons } from 'shared/enum/statuses';
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

  public height$: BehaviorSubject<number> = new BehaviorSubject(0);

  public readonly noWorkshops = NoResultsTitle.noResult;
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

  private resizeObserver: ResizeObserver;
  private readonly destroy$: Subject<void> = new Subject<void>();

  constructor(
    private readonly store: Store,
    private readonly matDialog: MatDialog
  ) {}

  @ViewChild('table', { read: ElementRef })
  public set table(tableRef: ElementRef) {
    if (tableRef) {
      this.resizeObserver = new ResizeObserver(() => {
        this.height$.next(tableRef.nativeElement.offsetHeight);
      });
      this.resizeObserver.observe(tableRef.nativeElement);
      this.height$.next(tableRef.nativeElement.offsetHeight);
    }
  }

  public set workshops(value: SearchResponse<WorkshopDraft[]>) {
    this.dataSource.data = value?.entities;
    this.totalEntities = value?.totalAmount;
  }

  public ngOnInit(): void {
    this.store.dispatch(
      new PushNavPath({
        name: NavBarName.WorkshopDrafts,
        isActive: false,
        disable: true
      })
    );

    this.workshopDrafts$.pipe(takeUntil(this.destroy$)).subscribe((workshops: SearchResponse<WorkshopDraft[]>) => {
      this.workshops = workshops;
    });
  }

  public onViewWorkshopInfo(workshop: WorkshopDraft): void {
    if (this.selectedWorkshopDraftId === workshop.workshopDraftId && this.isInfoDisplayed) {
      this.closeInfo();
      return;
    }

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
    this.resizeObserver?.disconnect();
    this.store.dispatch(new PopNavPath());
  }

  public getWorkshops(
    filterData: {
      parameters: WorkshopFilterAdministration;
      currentPage: PaginationElement;
    } = null
  ): void {
    if (filterData?.parameters && filterData?.currentPage) {
      this.workshopParameters = filterData.parameters;
      this.currentPage = filterData.currentPage;
    }
    Util.setFromPaginationParam(this.workshopParameters, this.currentPage, this.totalEntities);
    this.store.dispatch(new GetFilteredWorkshopDrafts(this.workshopParameters));
  }
}
