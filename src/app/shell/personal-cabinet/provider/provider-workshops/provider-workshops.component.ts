import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, ofAction, Select, Store } from '@ngxs/store';
import { filter, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants, ModeConstants, PaginationConstants } from 'shared/constants/constants';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { Role } from 'shared/enum/role';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { SearchResponse } from 'shared/models/search.model';
import { WorkshopBaseCard, WorkshopCardParameters, WorkshopProviderViewCard } from 'shared/models/workshop.model';
import { PushNavPath } from 'shared/store/navigation.actions';
import {
  ArchiveWorkshopById,
  GetEmployeeWorkshops,
  GetProviderViewWorkshops,
  GetUnfinishedWorkshop,
  OnUpdateWorkshopStatusSuccess
} from 'shared/store/provider.actions';
import { ProviderState } from 'shared/store/provider.state';
import { Util } from 'shared/utils/utils';
import { WINDOW } from 'ngx-window-token';
import { FormControl } from '@angular/forms';
import { BannerMode } from 'shared/enum/bannerMode';
import { WorkshopType } from 'shared/enum/workshop';
import { NoResultsTitle } from 'shared/enum/enumUA/no-results';
import { ProviderComponent } from '../provider.component';

@Component({
  selector: 'app-provider-workshops',
  templateUrl: './provider-workshops.component.html',
  styleUrls: ['./provider-workshops.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProviderWorkshopsComponent extends ProviderComponent implements OnInit, OnDestroy {
  @Select(ProviderState.providerWorkshops)
  public workshops$: Observable<SearchResponse<WorkshopProviderViewCard[]>>;
  @Select(ProviderState.hasUnfinishedWorkshopData)
  public hasUnfinishedWorkshopData$: Observable<boolean>;

  public readonly BannerMode = BannerMode;
  public readonly constants: typeof Constants = Constants;
  public readonly ModeConstants = ModeConstants;
  public readonly WorkshopType = WorkshopType;
  public readonly NoResultsTitle = NoResultsTitle;

  public workshops: SearchResponse<WorkshopProviderViewCard[]>;
  public currentPage: PaginationElement = { ...PaginationConstants.firstPage };
  public workshopCardParameters: WorkshopCardParameters = {
    providerId: '',
    size: PaginationConstants.WORKSHOPS_PER_PAGE
  };

  constructor(
    protected store: Store,
    protected matDialog: MatDialog,
    private actions$: Actions,
    @Inject(WINDOW) private window: Window,
    private cdr: ChangeDetectorRef
  ) {
    super(store, matDialog);
  }

  public ngOnInit(): void {
    super.ngOnInit();
    if (!this.store.selectSnapshot(ProviderState.hasUnfinishedWorkshopData)) {
      this.store.dispatch(new GetUnfinishedWorkshop());
    }
  }

  /**
   * This method set navigation path
   */
  public addNavPath(): void {
    this.store.dispatch(
      new PushNavPath({
        name: NavBarName.Workshops,
        isActive: false,
        disable: true
      })
    );
  }

  /**
   * This method get provider workshop according to the role
   */
  public initProviderData(): void {
    this.workshopCardParameters.providerId = this.provider.id;
    this.getProviderWorkshops();

    this.workshops$.pipe(takeUntil(this.destroy$)).subscribe((workshops: SearchResponse<WorkshopProviderViewCard[]>) => {
      this.workshops = workshops;
      this.cdr.markForCheck();
    });
    this.actions$.pipe(ofAction(OnUpdateWorkshopStatusSuccess), takeUntil(this.destroy$)).subscribe(() => this.getProviderWorkshops());
  }

  /**
   * This method deletes (archives) workshop By Workshop Id
   * @param workshop
   */
  public onArchive(workshop: WorkshopBaseCard): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.archiveWorkshop,
        property: workshop.title
      }
    });

    dialogRef
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => {
        this.store.dispatch(new ArchiveWorkshopById(workshop.id, this.workshopCardParameters));
      });
  }

  public onSearch(searchFormControl: FormControl): void {
    const searchText = searchFormControl.value;

    this.workshopCardParameters = {
      ...this.workshopCardParameters,
      searchText
    };

    this.getProviderWorkshops();
  }

  public onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.getProviderWorkshops();
    Util.scrollToTop(this.window);
  }

  public onItemsPerPageChange(itemsPerPage: number): void {
    this.workshopCardParameters.size = itemsPerPage;
    this.onPageChange(PaginationConstants.firstPage);
  }

  private getProviderWorkshops(): void {
    Util.setFromPaginationParam(this.workshopCardParameters, this.currentPage, this.workshops?.totalAmount);
    if (this.role === Role.provider || this.role === Role.providerDeputy) {
      this.store.dispatch(new GetProviderViewWorkshops(this.workshopCardParameters));
    } else {
      this.store.dispatch(new GetEmployeeWorkshops(this.workshopCardParameters));
    }
  }

  private trackById(index: number, item: WorkshopProviderViewCard): string {
    return item.id;
  }
}
