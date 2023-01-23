import { SetWorkshopsPerPage } from './../../../../shared/store/paginator.actions';
import { PaginatorState } from './../../../../shared/store/paginator.state';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Actions, ofAction, Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalWindowComponent } from '../../../../shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants, ModeConstants, PaginationConstants } from '../../../../shared/constants/constants';
import { ModalConfirmationType } from '../../../../shared/enum/modal-confirmation';
import { NavBarName } from '../../../../shared/enum/navigation-bar';
import { Role } from '../../../../shared/enum/role';
import { ProviderWorkshopCard, WorkshopCardParameters } from '../../../../shared/models/workshop.model';
import { PushNavPath } from '../../../../shared/store/navigation.actions';
import {
  OnUpdateWorkshopStatusSuccess,
  GetProviderViewWorkshops,
  GetProviderAdminWorkshops,
  DeleteWorkshopById
} from '../../../../shared/store/provider.actions';
import { ProviderState } from '../../../../shared/store/provider.state';
import { ProviderComponent } from '../provider.component';
import { SearchResponse } from '../../../../shared/models/search.model';
import { PaginationElement } from '../../../../shared/models/paginationElement.model';
import { OnPageChangeWorkshops } from '../../../../shared/store/paginator.actions';
import { Util } from 'src/app/shared/utils/utils';

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
  @Select(PaginatorState.workshopsPerPage)
  workshopsPerPage$: Observable<number>;

  currentPage: PaginationElement = PaginationConstants.firstPage;
  workshopCardParameters: WorkshopCardParameters = {
    providerId: ''
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
    const workshopsPerPage = this.store.selectSnapshot(PaginatorState.workshopsPerPage);
    Util.setPaginationParams(this.workshopCardParameters, this.currentPage, workshopsPerPage);

    this.getProviderWorkshops();
    this.workshops$
      .pipe(takeUntil(this.destroy$))
      .subscribe((workshops: SearchResponse<ProviderWorkshopCard[]>) => (this.workshops = workshops));
    this.actions$
      .pipe(ofAction(OnUpdateWorkshopStatusSuccess))
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.getProviderWorkshops());
  }

  getProviderWorkshops(): void {
    if (this.subRole === Role.None) {
      this.store.dispatch(new GetProviderViewWorkshops(this.workshopCardParameters));
    } else {
      this.store.dispatch(new GetProviderAdminWorkshops(this.workshopCardParameters));
    }
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
    Util.setPaginationParams(this.workshopCardParameters, this.currentPage, this.workshopCardParameters.size);
    this.getProviderWorkshops();
  }

  onItemsPerPageChange(itemPerPage: number) {
    Util.setPaginationParams(this.workshopCardParameters, this.currentPage, itemPerPage);
    this.store.dispatch(new SetWorkshopsPerPage(itemPerPage));
    this.getProviderWorkshops();
  }
}
