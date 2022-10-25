import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { filter, Observable, takeUntil } from 'rxjs';
import { Provider } from '../../../../shared/models/provider.model';
import { TruncatedItem } from '../../../../shared/models/truncated.model';
import { ProviderState } from '../../../../shared/store/provider.state';
import { Role } from '../../../../shared/enum/role';
import { RegistrationState } from '../../../../shared/store/registration.state';
import { GetWorkshopListByProviderId } from '../../../../shared/store/provider.actions';
import { WorkshopDeclination } from '../../../../shared/enum/enumUA/declinations/declination';
import { ParentWithContactInfo } from 'src/app/shared/models/parent.model';
import { ChatRoom } from 'src/app/shared/models/chat.model';
import { Workshop } from 'src/app/shared/models/workshop.model';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
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

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.userRole = this.store.selectSnapshot<Role>(RegistrationState.role);

    this.provider$
      .pipe(filter((provider: Provider) => !!provider))
      .subscribe((provider: Provider) => {
        this.providerId = provider.id;
        this.getProviderWorkshops();
      });
  }

  getProviderWorkshops() {
    this.store.dispatch(new GetWorkshopListByProviderId(this.providerId));
  }
}
