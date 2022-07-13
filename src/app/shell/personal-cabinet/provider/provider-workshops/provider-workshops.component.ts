import { DeleteWorkshopById, GetProviderAdminWorkshops } from 'src/app/shared/store/user.actions';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { Provider } from 'src/app/shared/models/provider.model';
import { WorkshopCard } from 'src/app/shared/models/workshop.model';
import { GetWorkshopsByProviderId } from 'src/app/shared/store/user.actions';
import { UserState } from 'src/app/shared/store/user.state';
import { CabinetDataComponent } from '../../cabinet-data/cabinet-data.component';
import { Constants } from 'src/app/shared/constants/constants';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalWindowComponent } 
  from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { Role } from 'src/app/shared/enum/role';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { PushNavPath } from 'src/app/shared/store/navigation.actions';

@Component({
  selector: 'app-provider-workshops',
  templateUrl: './provider-workshops.component.html',
  styleUrls: ['./provider-workshops.component.scss'],
})
export class ProviderWorkshopsComponent extends CabinetDataComponent implements OnInit, OnDestroy {
  readonly constants: typeof Constants = Constants;

  @Select(UserState.workshops)
  workshops$: Observable<WorkshopCard[]>;

  constructor(protected store: Store, protected matDialog: MatDialog) {
    super(store, matDialog);
  }

  /**
   * This method subscribe on provider and get it's workshops
   */
  init(): void {
    this.provider$
      .pipe(
        filter((provider: Provider) => !!provider),
        takeUntil(this.destroy$)
      )
      .subscribe((provider: Provider) => {
        this.provider = provider;
        this.getProviderWorkshops();
      });
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
  getProviderWorkshops(): void {
    console.log(this.subRole)
    if (this.subRole === Role.None) {
      this.store.dispatch(new GetWorkshopsByProviderId(this.provider.id));
    } else {
      this.store.dispatch(new GetProviderAdminWorkshops());
    }
  }

  /**
   * This method delete workshop By Workshop Id
   * @param workshop: WorkshopCard
   */
  onDelete(workshop: WorkshopCard): void {
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
