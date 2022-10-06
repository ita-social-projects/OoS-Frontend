import { Component, OnInit, OnDestroy } from '@angular/core';
import { Actions, ofAction, Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalWindowComponent } from '../../../../shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants } from '../../../../shared/constants/constants';
import { ModalConfirmationType } from '../../../../shared/enum/modal-confirmation';
import { NavBarName } from '../../../../shared/enum/navigation-bar';
import { Role } from '../../../../shared/enum/role';
import { ProviderWorkshopCard } from '../../../../shared/models/workshop.model';
import { PushNavPath } from '../../../../shared/store/navigation.actions';
import { OnUpdateWorkshopStatusSuccess, GetProviderWorkshops, GetProviderAdminWorkshops, DeleteWorkshopById } from '../../../../shared/store/provider.actions';
import { ProviderState } from '../../../../shared/store/provider.state';
import { ProviderComponent } from '../provider.component';

@Component({
  selector: 'app-provider-workshops',
  templateUrl: './provider-workshops.component.html',
  styleUrls: ['./provider-workshops.component.scss'],
})
export class ProviderWorkshopsComponent extends ProviderComponent implements OnInit, OnDestroy {
  readonly constants: typeof Constants = Constants;

  @Select(ProviderState.providerWorkshops)
    workshops$: Observable<ProviderWorkshopCard[]>;

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
        disable: true,
      })
    );
  }

  /**
   * This method get provider workshop according to the subrole
   */
  initProviderData(): void {
    this.getProviderWorkshops();
    this.actions$
      .pipe(ofAction(OnUpdateWorkshopStatusSuccess))
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.getProviderWorkshops());
  }

  getProviderWorkshops(): void {
    if (this.subRole === Role.None) {
      this.store.dispatch(new GetProviderWorkshops(this.provider.id));
    } else {
      this.store.dispatch(new GetProviderAdminWorkshops());
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
        property: workshop.title,
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      result && this.store.dispatch(new DeleteWorkshopById(workshop));
    });
  }
}
