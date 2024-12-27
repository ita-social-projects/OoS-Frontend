import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, Select, Store, ofAction } from '@ngxs/store';
import { Observable, filter } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants, ModeConstants, PaginationConstants } from 'shared/constants/constants';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { Role } from 'shared/enum/role';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { SearchResponse } from 'shared/models/search.model';
import { WorkshopCardParameters, WorkshopProviderViewCard } from 'shared/models/workshop.model';
import { PushNavPath } from 'shared/store/navigation.actions';
import {
  DeleteWorkshopById,
  GetEmployeeWorkshops,
  GetProviderViewWorkshops,
  OnUpdateWorkshopStatusSuccess
} from 'shared/store/provider.actions';
import { ProviderState } from 'shared/store/provider.state';
import { Util } from 'shared/utils/utils';
import { ProviderComponent } from '../provider.component';

@Component({
  selector: 'app-provider-workshops',
  templateUrl: './provider-workshops.component.html',
  styleUrls: ['./provider-workshops.component.scss']
})
export class ProviderWorkshopsComponent extends ProviderComponent implements OnInit, OnDestroy {
  @Select(ProviderState.providerWorkshops)
  public workshops$: Observable<SearchResponse<WorkshopProviderViewCard[]>>;

  public readonly constants: typeof Constants = Constants;
  public readonly ModeConstants = ModeConstants;

  public workshops: SearchResponse<WorkshopProviderViewCard[]>;
  public currentPage: PaginationElement = PaginationConstants.firstPage;
  public workshopCardParameters: WorkshopCardParameters = {
    providerId: '',
    size: PaginationConstants.WORKSHOPS_PER_PAGE
  };

  constructor(
    protected store: Store,
    protected matDialog: MatDialog,
    private actions$: Actions
  ) {
    super(store, matDialog);
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

    this.workshops$
      .pipe(takeUntil(this.destroy$))
      .subscribe((workshops: SearchResponse<WorkshopProviderViewCard[]>) => (this.workshops = workshops));
    this.actions$
      .pipe(ofAction(OnUpdateWorkshopStatusSuccess))
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.getProviderWorkshops());
  }

  /**
   * This method delete workshop By Workshop Id
   * @param workshop
   */
  public onDelete(workshop: WorkshopProviderViewCard): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.delete,
        property: workshop.title
      }
    });

    dialogRef
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe((result: boolean) => {
        this.store.dispatch(new DeleteWorkshopById(workshop, this.workshopCardParameters));
      });
  }

  public onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.getProviderWorkshops();
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
}
