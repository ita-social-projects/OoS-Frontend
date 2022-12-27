import { Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { debounceTime, distinctUntilChanged, filter, Observable, takeUntil } from 'rxjs';
import { Provider } from '../../../../shared/models/provider.model';
import { TruncatedItem } from '../../../../shared/models/item.model';
import { ProviderState } from '../../../../shared/store/provider.state';
import { Role } from '../../../../shared/enum/role';
import { RegistrationState } from '../../../../shared/store/registration.state';
import {
  BlockParent,
  GetProviderAdminWorkshops,
  GetWorkshopListByProviderId,
  UnBlockParent
} from '../../../../shared/store/provider.actions';
import { WorkshopDeclination } from '../../../../shared/enum/enumUA/declinations/declination';
import { ChatRoom, ChatRoomsParameters } from '../../../../shared/models/chat.model';
import { ConfirmationModalWindowComponent } from '../../../../shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants, PaginationConstants } from '../../../../shared/constants/constants';
import { ModalConfirmationType } from '../../../../shared/enum/modal-confirmation';
import { BlockedParent } from '../../../../shared/models/block.model';
import { CabinetDataComponent } from '../cabinet-data.component';
import { MatDialog } from '@angular/material/dialog';
import { NavBarName } from '../../../../shared/enum/navigation-bar';
import { PushNavPath } from '../../../..//shared/store/navigation.actions';
import { GetUserChatRooms } from '../../../..//shared/store/chat.actions';
import { FormControl } from '@angular/forms';
import { ChatState } from '../../../../shared/store/chat.state';
import { NoResultsTitle } from '../../../../shared/enum/no-results';
import { ReasonModalWindowComponent } from '../../../../shared/components/confirmation-modal-window/reason-modal-window/reason-modal-window.component';
import { ApplicationEntityType } from '../../../../shared/enum/applications';
import { PaginatorState } from '../../../../shared/store/paginator.state';
import { PaginationElement } from '../../../../shared/models/paginationElement.model';
import { OnPageChangeChatRooms, SetChatRoomsPerPage } from '../../../../shared/store/paginator.actions';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent extends CabinetDataComponent {
  readonly Role = Role;
  readonly WorkshopDeclination = WorkshopDeclination;
  readonly noMessagesTitle = NoResultsTitle.noMessages;

  providerId: string;
  filterFormControl: FormControl = new FormControl('');
  //TODO: After fixing the data model on Search Response, change the type to SearchResponse<ChatRoom[]>
  chatRooms: ChatRoom[];
  currentPage: PaginationElement = PaginationConstants.firstPage;
  chatRoomsParameters: ChatRoomsParameters = {
    workshopIds: null,
    searchText: null,
    from: 0,
    size: 8
  };

  @Select(PaginatorState.chatRoomsPerPage)
  chatRoomsPerPage$: Observable<number>;
  @Select(ProviderState.truncated)
  workshops$: Observable<TruncatedItem[]>;
  @Select(RegistrationState.provider)
  provider$: Observable<Provider>;
  //TODO: After fixing the data model on Search Response, change the type to Observable<SearchResponse<ChatRoom[]>>
  @Select(ChatState.chatRooms)
  chatRooms$: Observable<ChatRoom[]>;

  constructor(protected store: Store, protected matDialog: MatDialog) {
    super(store, matDialog);
  }

  protected init(): void {
    if (this.role === Role.provider) {
      this.provider$
        .pipe(
          filter((provider: Provider) => !!provider),
          takeUntil(this.destroy$)
        )
        .subscribe((provider: Provider) => {
          this.providerId = provider.id;
          this.getProviderWorkshops();
        });
    }

    this.getChats();
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

  getProviderWorkshops(): void {
    if (this.subRole === Role.None) {
      this.store.dispatch(new GetWorkshopListByProviderId(this.providerId));
    } else {
      this.store.dispatch(new GetProviderAdminWorkshops());
    }
  }

  getChats(): void {
    this.store.dispatch(new GetUserChatRooms(this.chatRoomsParameters));
  }

  setListeners(): void {
    this.chatRooms$.pipe(takeUntil(this.destroy$)).subscribe((chatRooms: ChatRoom[]) => (this.chatRooms = chatRooms));

    this.filterFormControl.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(500), distinctUntilChanged())
      .subscribe((val: string) => {
        this.chatRoomsParameters.searchText = val;
        this.store.dispatch(new GetUserChatRooms(this.chatRoomsParameters));
      });
  }

  onBlock(parentId: string): void {
    const dialogRef = this.matDialog.open(ReasonModalWindowComponent, {
      data: { type: ModalConfirmationType.blockParent }
    });
    dialogRef.afterClosed().subscribe((result: string) => {
      if (result) {
        const blockedParent = new BlockedParent(parentId, this.providerId, result);
        this.store.dispatch(new BlockParent(blockedParent, ApplicationEntityType[this.subRole]));
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
        const blockedParent = new BlockedParent(parentId, this.providerId);
        this.store.dispatch(new UnBlockParent(blockedParent, ApplicationEntityType[this.subRole]));
      }
    });
  }

  onEntitiesSelect(IDs: string[]): void {
    this.chatRoomsParameters.workshopIds = IDs;
    this.store.dispatch(new GetUserChatRooms(this.chatRoomsParameters));
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.store.dispatch([new SetChatRoomsPerPage(itemsPerPage), new GetUserChatRooms(this.chatRoomsParameters)]);
  }

  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.store.dispatch([new OnPageChangeChatRooms(page), new GetUserChatRooms(this.chatRoomsParameters)]);
  }
}
