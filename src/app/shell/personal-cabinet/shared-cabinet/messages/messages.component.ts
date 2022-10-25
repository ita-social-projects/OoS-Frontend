import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  Observable,
  takeUntil
} from 'rxjs';
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
import { GetUserChatRooms } from 'src/app/shared/store/chat.actions';
import { FormControl } from '@angular/forms';
import { ChatState } from 'src/app/shared/store/chat.state';
import { SearchResponse } from 'src/app/shared/models/search.model';
import { NoResultsTitle } from 'src/app/shared/enum/no-results';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent extends CabinetDataComponent implements OnInit {
  readonly Role = Role;
  readonly WorkshopDeclination = WorkshopDeclination;
  readonly noMessagesTitle = NoResultsTitle.noMessages;

  userRole: Role;
  providerId: string;
  filterFormControl: FormControl = new FormControl('');
  chatRooms: SearchResponse<ChatRoom[]> = { entities: [], totalAmount: 0 };

  @Select(ProviderState.truncated)
  workshops$: Observable<TruncatedItem[]>;
  @Select(RegistrationState.provider)
  provider$: Observable<Provider>;
  @Select(ChatState.chatRooms)
  chatRooms$: Observable<SearchResponse<ChatRoom[]>>;

  constructor(protected store: Store, protected matDialog: MatDialog) {
    super(store, matDialog);
  }

  protected init(): void {
    this.userRole = this.store.selectSnapshot<Role>(RegistrationState.role);

    this.provider$
      .pipe(filter((provider: Provider) => !!provider))
      .subscribe((provider: Provider) => {
        this.providerId = provider.id;

        if (this.userRole == Role.provider) {
          this.getProviderWorkshops();
        }
        this.getChats();
      });

    this.setListeners();
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

  getChats() {
    this.store.dispatch(new GetUserChatRooms(this.userRole));
  }

  setListeners() {
    this.chatRooms.entities = this.mockChatRoom;
    this.chatRooms.totalAmount = this.mockChatRoom.length;

    this.chatRooms$
      .pipe(
        filter((chatRooms: SearchResponse<ChatRoom[]>) => !!chatRooms),
        takeUntil(this.destroy$)
      )
      .subscribe((chatRooms: SearchResponse<ChatRoom[]>) => {
        this.chatRooms = chatRooms;
      });

    this.filterFormControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(200),
        distinctUntilChanged(),
        filter((val: string) => !!val)
      )
      .subscribe((val: string) => {
        //TODO: Implement search logic
      });
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

  onEntitiesSelect(IDs: string[]): void {
    //Need to be implemented when requests with parameters are made
  }

  //Delete after connecting to server
  mockChatRoom: ChatRoom[] = [
    {
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
    },
    {
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
    }
  ];
}
