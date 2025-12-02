import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable, debounceTime, distinctUntilChanged, filter, switchMap, takeUntil } from 'rxjs';

import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ReasonModalWindowComponent } from 'shared/components/confirmation-modal-window/reason-modal-window/reason-modal-window.component';
import { Constants, PaginationConstants } from 'shared/constants/constants';
import { WorkshopDeclination } from 'shared/enum/enumUA/declinations/declination';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { NoResultsTitle } from 'shared/enum/enumUA/no-results';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { Role } from 'shared/enum/role';
import { BlockedParent } from 'shared/models/block.model';
import { ChatRoom, ChatRoomsParameters } from 'shared/models/chat.model';
import { TruncatedItem } from 'shared/models/item.model';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { Provider } from 'shared/models/provider.model';
import { SearchResponse } from 'shared/models/search.model';
import { GetChatRooms } from 'shared/store/chat.actions';
import { ChatState } from 'shared/store/chat.state';
import { PushNavPath } from 'shared/store/navigation.actions';
import { BlockParent, GetWorkshopListByProviderId, UnBlockParent } from 'shared/store/provider.actions';
import { ProviderState } from 'shared/store/provider.state';
import { RegistrationState } from 'shared/store/registration.state';
import { Util } from 'shared/utils/utils';
import { isRoleProvider } from 'shared/utils/provider.utils';
import { CabinetDataComponent } from '../cabinet-data.component';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent extends CabinetDataComponent {
  @Select(ProviderState.truncated)
  protected workshops$: Observable<TruncatedItem[]>;
  @Select(RegistrationState.provider)
  private provider$: Observable<Provider>;
  @Select(ChatState.chatRooms)
  private chatRooms$: Observable<SearchResponse<ChatRoom[]>>;

  public readonly WorkshopDeclination = WorkshopDeclination;
  public readonly noMessagesTitle = NoResultsTitle.noMessages;
  public readonly isRoleProvider = isRoleProvider;

  public providerId: string;
  public filterFormControl: FormControl = new FormControl('');
  public chatRooms: SearchResponse<ChatRoom[]>;
  public currentPage: PaginationElement = PaginationConstants.firstPage;
  public chatRoomsParameters: ChatRoomsParameters = {
    role: null,
    workshopIds: null,
    searchText: null,
    size: PaginationConstants.CHATROOMS_PER_PAGE
  };

  constructor(
    protected store: Store,
    protected matDialog: MatDialog
  ) {
    super(store, matDialog);
  }

  public getProviderWorkshops(): void {
    if (isRoleProvider(this.role)) {
      this.store.dispatch(new GetWorkshopListByProviderId(this.providerId));
    }
  }

  public setListeners(): void {
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

  public onBlock(parentId: string): void {
    this.matDialog
      .open(ReasonModalWindowComponent, {
        data: { type: ModalConfirmationType.blockParent }
      })
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap((result) => {
          const blockedParent = new BlockedParent(parentId, this.providerId, result);
          blockedParent.userIdBlock = this.providerId;
          return this.store.dispatch(new BlockParent(blockedParent));
        }),
        switchMap(() => this.store.dispatch(new GetChatRooms(this.chatRoomsParameters)))
      )
      .subscribe();
  }

  public onUnBlock(parentId: string): void {
    this.matDialog
      .open(ConfirmationModalWindowComponent, {
        width: Constants.MODAL_SMALL,
        data: {
          type: ModalConfirmationType.unBlockParent
        }
      })
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(() => {
          const blockedParent = new BlockedParent(parentId, this.providerId);
          blockedParent.userIdUnblock = this.providerId;
          return this.store.dispatch(new UnBlockParent(blockedParent));
        }),
        switchMap(() => this.store.dispatch(new GetChatRooms(this.chatRoomsParameters)))
      )
      .subscribe();
  }

  public onEntitiesSelect(workshopIds: string[]): void {
    this.currentPage = PaginationConstants.firstPage;
    this.chatRoomsParameters.workshopIds = workshopIds;
    this.getChatRooms();
  }

  public onItemsPerPageChange(itemsPerPage: number): void {
    this.chatRoomsParameters.size = itemsPerPage;
    this.onPageChange(PaginationConstants.firstPage);
  }

  public onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.getChatRooms();
  }

  protected init(): void {
    this.chatRoomsParameters.role = this.role;

    if (isRoleProvider(this.role)) {
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

  private getChatRooms(): void {
    Util.setFromPaginationParam(this.chatRoomsParameters, this.currentPage, this.chatRooms?.totalAmount);
    this.store.dispatch(new GetChatRooms(this.chatRoomsParameters));
  }
}
