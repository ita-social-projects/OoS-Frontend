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
import { NoResultsTitle } from '../../../../shared/enum/enumUA/no-results';
import { ReasonModalWindowComponent } from '../../../../shared/components/confirmation-modal-window/reason-modal-window/reason-modal-window.component';
import { ApplicationEntityType } from '../../../../shared/enum/applications';
import { PaginationElement } from '../../../../shared/models/paginationElement.model';
import { SearchResponse } from '../../../../shared/models/search.model';
import { Util } from '../../../../shared/utils/utils';

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
  chatRooms: SearchResponse<ChatRoom[]>;
  currentPage: PaginationElement = PaginationConstants.firstPage;
  chatRoomsParameters: ChatRoomsParameters = {
    role: null,
    workshopIds: null,
    searchText: null,
    size: PaginationConstants.CHATROOMS_PER_PAGE
  };

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
    this.chatRoomsParameters.role = this.role;

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

    this.getChatRooms();
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
    }
  }

  setListeners(): void {
    this.chatRooms$
      .pipe(filter(Boolean), takeUntil(this.destroy$))
      .subscribe((chatRooms: SearchResponse<ChatRoom[]>) => (this.chatRooms = chatRooms));

    this.filterFormControl.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(500), distinctUntilChanged())
      .subscribe((val: string) => {
        this.chatRoomsParameters.searchText = val;
        this.currentPage = PaginationConstants.firstPage;
        this.getChatRooms();
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

  onEntitiesSelect(workshopIds: string[]): void {
    this.currentPage = PaginationConstants.firstPage;
    this.chatRoomsParameters.workshopIds = workshopIds;
    this.getChatRooms();
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.chatRoomsParameters.size = itemsPerPage;
    this.getChatRooms();
  }

  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.getChatRooms();
  }

  private getChatRooms(): void {
    Util.setFromPaginationParam(this.chatRoomsParameters, this.currentPage, this.chatRooms?.totalAmount);
    this.store.dispatch(new GetUserChatRooms(this.chatRoomsParameters));
  }
}
