import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, ofAction, Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants, ModeConstants, PaginationConstants } from 'shared/constants/constants';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { Role } from 'shared/enum/role';
import { PaginationElement } from 'shared/models/paginationElement.model';
import { SearchResponse } from 'shared/models/search.model';
import { ProviderWorkshopCard, WorkshopCardParameters } from 'shared/models/workshop.model';
import { PushNavPath } from 'shared/store/navigation.actions';
import {
  DeleteWorkshopById,
  GetProviderAdminWorkshops,
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
  readonly constants: typeof Constants = Constants;
  readonly ModeConstants = ModeConstants;

  @Select(ProviderState.providerWorkshops)
  workshops$: Observable<SearchResponse<ProviderWorkshopCard[]>>;
  workshops: SearchResponse<ProviderWorkshopCard[]>;

  currentPage: PaginationElement = PaginationConstants.firstPage;
  workshopCardParameters: WorkshopCardParameters = {
    providerId: '',
    size: PaginationConstants.WORKSHOPS_PER_PAGE
  };

  constructor(protected store: Store, protected matDialog: MatDialog, private actions$: Actions) {
    super(store, matDialog);
  }

  /**
   * This method set navigation path
   */
  addNavPath(): void {
    this.store.dispatch(
      new PushNavPath({
        name: NavBarName.Workshops,
        isActive: false,
        disable: true
      })
    );
  }

  /**
   * This method get provider workshop according to the subrole
   */
  initProviderData(): void {
    this.workshopCardParameters.providerId = this.provider.id;
    this.getProviderWorkshops();

    this.workshops$
      .pipe(takeUntil(this.destroy$))
      .subscribe((workshops: SearchResponse<ProviderWorkshopCard[]>) => (this.workshops = workshops));
    this.actions$
      .pipe(ofAction(OnUpdateWorkshopStatusSuccess))
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.getProviderWorkshops());
  }

  /**
   * This method delete workshop By Workshop Id
   * @param workshop: ProviderWorkshopCard
   */
  onDelete(workshop: ProviderWorkshopCard): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.delete,
        property: workshop.title
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      result && this.store.dispatch(new DeleteWorkshopById(workshop, this.workshopCardParameters));
    });
  }

  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.getProviderWorkshops();
  }

  onItemsPerPageChange(itemsPerPage: number) {
    this.workshopCardParameters.size = itemsPerPage;
    this.onPageChange(PaginationConstants.firstPage);
  }

  private getProviderWorkshops(): void {
    Util.setFromPaginationParam(this.workshopCardParameters, this.currentPage, this.workshops?.totalAmount);
    if (this.subRole === Role.None) {
      this.store.dispatch(new GetProviderViewWorkshops(this.workshopCardParameters));
    } else {
      this.store.dispatch(new GetProviderAdminWorkshops(this.workshopCardParameters));
    }
  }
}
