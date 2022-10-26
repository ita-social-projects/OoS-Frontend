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
import { ChatRoom } from '../../../../shared/models/chat.model';
import { Workshop } from '../../../../shared/models/workshop.model';
import { ConfirmationModalWindowComponent } from '../../../../shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants } from '../../../../shared/constants/constants';
import { ModalConfirmationType } from '../../../../shared/enum/modal-confirmation';
import { BlockedParent } from '../../../../shared/models/block.model';
import { ReasonModalWindowComponent } from '../applications/reason-modal-window/reason-modal-window.component';
import { CabinetDataComponent } from '../cabinet-data.component';
import { MatDialog } from '@angular/material/dialog';
import { NavBarName } from '../../../../shared/enum/navigation-bar';
import { PushNavPath } from '../../../..//shared/store/navigation.actions';
import { GetUserChatRooms } from '../../../..//shared/store/chat.actions';
import { FormControl } from '@angular/forms';
import { ChatState } from '../../../../shared/store/chat.state';
import { SearchResponse } from '../../../../shared/models/search.model';
import { NoResultsTitle } from '../../../../shared/enum/no-results';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent extends CabinetDataComponent implements OnInit {
  readonly Role = Role;
  readonly WorkshopDeclination = WorkshopDeclination;
  readonly noMessagesTitle = NoResultsTitle.noMessages;

  providerId: string;
  filterFormControl: FormControl = new FormControl('');
  chatRooms: ChatRoom[];

  @Select(ProviderState.truncated)
  workshops$: Observable<TruncatedItem[]>;
  @Select(RegistrationState.provider)
  provider$: Observable<Provider>;
  @Select(ChatState.chatRooms)
  chatRooms$: Observable<ChatRoom[]>;

  constructor(protected store: Store, protected matDialog: MatDialog) {
    super(store, matDialog);
  }

  protected init(): void {
    this.provider$
      .pipe(filter((provider: Provider) => !!provider))
      .subscribe((provider: Provider) => {
        this.providerId = provider.id;
        this.getProviderWorkshops();
      });
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
    this.store.dispatch(new GetWorkshopListByProviderId(this.providerId));
  }

  getChats(): void {
    this.store.dispatch(new GetUserChatRooms(this.role));
  }

  setListeners(): void {
    this.chatRooms$
      .pipe(
        filter((chatRooms: ChatRoom[]) => !!chatRooms),
        takeUntil(this.destroy$)
      )
      .subscribe((chatRooms: ChatRoom[]) => (this.chatRooms = chatRooms));

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
        const blockedParent = new BlockedParent(
          parentId,
          this.providerId,
          result
        );
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
        const blockedParent = new BlockedParent(parentId, this.providerId);
        this.store.dispatch(
          new UnBlockParent(blockedParent, EntityType[this.subRole])
        );
      }
    });
  }

  onEntitiesSelect(IDs: string[]): void {
    //TODO: Need to be implemented when requests with parameters are made
  }
}
