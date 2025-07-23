import { Component, Inject, Input } from '@angular/core';
import { Constants, ModeConstants, PaginationConstants } from 'shared/constants/constants';
import { Actions, Select, Store } from '@ngxs/store';
import { ProviderState } from 'shared/store/provider.state';
import { filter, Observable } from 'rxjs';
import { SearchResponse } from 'shared/models/search.model';
import { WorkshopCardParameters, WorkshopDraftCard } from 'shared/models/workshop.model';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { MatDialog } from '@angular/material/dialog';
import { WINDOW } from 'ngx-window-token';
import { DeleteWorkshopDraftById, GetProviderViewWorkshopDrafts } from 'shared/store/provider.actions';
import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { Util } from 'shared/utils/utils';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Role } from 'shared/enum/role';

@Component({
  selector: 'app-workshop-drafts',
  templateUrl: './workshop-drafts.component.html',
  styleUrl: './workshop-drafts.component.scss'
})
export class WorkshopDraftsComponent {
  @Input() public role: Role;
  @Input() public isLoading: boolean;
  @Select(ProviderState.providerWorkshopDrafts)
  public workshopDrafts$: Observable<SearchResponse<WorkshopDraftCard[]>>;

  public readonly constants: typeof Constants = Constants;
  public readonly ModeConstants = ModeConstants;

  public workshopDrafts: SearchResponse<WorkshopDraftCard[]>;
  public currentPage: PaginationElement = PaginationConstants.firstPage;
  public workshopCardParameters: WorkshopCardParameters = {
    providerId: '',
    size: PaginationConstants.WORKSHOPS_PER_PAGE
  };

  constructor(
    protected store: Store,
    protected matDialog: MatDialog,
    private actions$: Actions,
    @Inject(WINDOW) private window: Window
  ) {}

  /**
   * This method delete workshop By Workshop Id
   * @param workshop
   */
  public onDelete(workshop: WorkshopDraftCard): void {
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
      .subscribe(() => {
        this.store.dispatch(new DeleteWorkshopDraftById(workshop, this.workshopCardParameters));
      });
  }

  public onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.getProviderDrafts();
    Util.scrollToTop(this.window);
  }

  public onItemsPerPageChange(itemsPerPage: number): void {
    this.workshopCardParameters.size = itemsPerPage;
    this.onPageChange(PaginationConstants.firstPage);
  }

  public trackByDraft(index: number, item: WorkshopDraftCard): string {
    return item.workshopDraftId;
  }

  public onTabChange(event: MatTabChangeEvent): void {
    return;
  }

  private getProviderDrafts(): void {
    Util.setFromPaginationParam(this.workshopCardParameters, this.currentPage, this.workshopDrafts?.totalAmount);
    if (this.role === Role.provider || this.role === Role.providerDeputy) {
      this.store.dispatch(new GetProviderViewWorkshopDrafts(this.workshopCardParameters));
    }
  }
}
