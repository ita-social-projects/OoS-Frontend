import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { filter, Observable, takeUntil } from 'rxjs';
import { Provider } from '../../../../shared/models/provider.model';
import { TruncatedItem } from '../../../../shared/models/truncated.model';
import { ProviderState } from '../../../../shared/store/provider.state';
import { EntityType, Role } from '../../../../shared/enum/role';
import { RegistrationState } from '../../../../shared/store/registration.state';
import {
  BlockParent,
  GetWorkshopListByProviderId,
  UnBlockParent
} from '../../../../shared/store/provider.actions';
import { WorkshopDeclination } from '../../../../shared/enum/enumUA/declinations/declination';
import { ParentWithContactInfo } from 'src/app/shared/models/parent.model';
import { ChatRoom } from 'src/app/shared/models/chat.model';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants } from 'src/app/shared/constants/constants';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { BlockedParent } from 'src/app/shared/models/block.model';
import { ReasonModalWindowComponent } from '../applications/reason-modal-window/reason-modal-window.component';
import { CabinetDataComponent } from '../cabinet-data.component';
import { MatDialog } from '@angular/material/dialog';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { PushNavPath } from 'src/app/shared/store/navigation.actions';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent extends CabinetDataComponent implements OnInit {
  readonly Role = Role;
  readonly WorkshopDeclination = WorkshopDeclination;

  //TODO: Delete after connecting to server
  mockChatRoom: ChatRoom = {
    id: 'mockId',
    parentId: 'mockParentId',
    workshopId: 'mockWorkShopId',
    parent: {
      id: 'mockParentId',
      userId: 'mockUserId',
      firstName: 'mockFName',
      lastName: 'mockLName',
      email: 'mockEmail',
      phoneNumber: 'mockNumber',
      middleName: 'mockMName'
    },
    workshop: {
      id: 'mockWorkShopId',
      providerTitle: 'mockProviderTitle',
      title: 'mockTitle',
      providerId: 'mockProviderId'
    } as Workshop,
    notReadByCurrentUserMessagesCount: 1,
    lastMessage: {
      id: 'mockMessageId',
      chatRoomId: 'mockId',
      text: 'mockText',
      senderRoleIsProvider: false,
      createdDateTime: '2022-10-25T09:59:08.504Z'
    }
  };

  userRole: Role;
  providerId: string;

  @Select(ProviderState.truncated)
  workshops$: Observable<TruncatedItem[]>;
  @Select(RegistrationState.provider)
  provider$: Observable<Provider>;

  constructor(protected store: Store, protected matDialog: MatDialog) {
    super(store, matDialog);
  }

  protected init(): void {
    this.userRole = this.store.selectSnapshot<Role>(RegistrationState.role);

    this.provider$
      .pipe(filter((provider: Provider) => !!provider))
      .subscribe((provider: Provider) => {
        this.providerId = provider.id;
        this.getProviderWorkshops();
      });
  }

  protected addNavPath(): void {
    this.store.dispatch(
      new PushNavPath({
        name: NavBarName.Messages,
        isActive: false,
        disable: true
      })
    );
  }

  getProviderWorkshops() {
    this.store.dispatch(new GetWorkshopListByProviderId(this.providerId));
  }

  onBlock(parentId: string): void {
    const dialogRef = this.matDialog.open(ReasonModalWindowComponent, {
      data: { type: ModalConfirmationType.blockParent }
    });
    dialogRef.afterClosed().subscribe((result: string) => {
      if (result) {
        const providerId = this.store.selectSnapshot<Provider>(
          RegistrationState.provider
        ).id;
        const blockedParent = new BlockedParent(parentId, providerId, result);
        this.store.dispatch(
          new BlockParent(blockedParent, EntityType[this.subRole])
        );
      }
    });
  }

  /**
   * This method emit unblock Application
   * @param Application application
   */
  onUnBlock(parentId: string): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.unBlockParent
      }
    });
    dialogRef.afterClosed().subscribe((result: string) => {
      if (result) {
        const providerId = this.store.selectSnapshot<Provider>(
          RegistrationState.provider
        ).id;
        const blockedParent = new BlockedParent(parentId, providerId);
        this.store.dispatch(
          new UnBlockParent(blockedParent, EntityType[this.subRole])
        );
      }
    });
  }
}
