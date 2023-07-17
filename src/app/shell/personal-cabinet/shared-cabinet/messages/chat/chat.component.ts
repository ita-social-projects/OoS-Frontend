import { combineLatest, filter, map, Observable, Subject, takeUntil } from 'rxjs';

import { Location } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as signalR from '@microsoft/signalr';
import { Select, Store } from '@ngxs/store';

import { ModeConstants } from '../../../../../shared/constants/constants';
import { CHAT_HUB_URL } from '../../../../../shared/constants/hubs-Url';
import { NavBarName } from '../../../../../shared/enum/enumUA/navigation-bar';
import { Role } from '../../../../../shared/enum/role';
import { ChatRoom, IncomingMessage, MessagesParameters, OutgoingMessage } from '../../../../../shared/models/chat.model';
import { Parent } from '../../../../../shared/models/parent.model';
import { User } from '../../../../../shared/models/user.model';
import { Workshop } from '../../../../../shared/models/workshop.model';
import { SignalRService } from '../../../../../shared/services/signalR/signal-r.service';
import {
  ClearSelectedChatRoom,
  GetChatRoomById,
  GetChatRoomMessages,
  GetChatRoomMessagesByWorkshopId
} from '../../../../../shared/store/chat.actions';
import { ChatState } from '../../../../../shared/store/chat.state';
import { PopNavPath, PushNavPath } from '../../../../../shared/store/navigation.actions';
import { RegistrationState } from '../../../../../shared/store/registration.state';
import { GetWorkshopById, ResetProviderWorkshopDetails } from '../../../../../shared/store/shared-user.actions';
import { SharedUserState } from '../../../../../shared/store/shared-user.state';
import { Util } from '../../../../../shared/utils/utils';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chat')
  private chatEl: ElementRef;

  @Select(ChatState.selectedChatRoomMessages)
  private messages$: Observable<IncomingMessage[]>;
  public messages: IncomingMessage[] = [];
  @Select(ChatState.selectedChatRoom)
  private chatRoom$: Observable<ChatRoom>;
  @Select(SharedUserState.selectedWorkshop)
  private workshop$: Observable<Workshop>;
  @Select(RegistrationState.user)
  private user$: Observable<User>;
  @Select(RegistrationState.parent)
  private parent$: Observable<Parent>;

  private messagesParameters: MessagesParameters = {
    from: 0,
    size: 20
  };
  private chatRoom: ChatRoom;
  private userRole: Role;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  private hubConnection: signalR.HubConnection;
  private isHistoryLoading = false;
  private mode: string;

  public messageControl: FormControl = new FormControl('');
  public userIsProvider: boolean;
  public userName: string;
  public companionName: string;

  constructor(private store: Store, private route: ActivatedRoute, private location: Location, private signalRService: SignalRService) {}

  public ngOnInit(): void {
    this.addNavPath();
    this.getUserRole();
    this.getChatRoom();
    this.createHubConnection();
  }

  public ngAfterViewInit(): void {
    this.setChatSubscriptions();

    this.chatEl.nativeElement.onscroll = () => {
      if (this.chatEl.nativeElement.scrollTop < 10) {
        this.chatEl.nativeElement.scrollTop = 10;

        if (!this.isHistoryLoading) {
          this.isHistoryLoading = true;
          this.messagesParameters.from = this.messages.length;
          if (this.mode === ModeConstants.WORKSHOP) {
            this.store.dispatch(new GetChatRoomMessagesByWorkshopId(this.chatRoom.workshopId, this.messagesParameters));
          } else {
            this.store.dispatch(new GetChatRoomMessages(this.chatRoom.id, this.userRole, this.messagesParameters));
          }
        }
      }
    };
  }

  public onSendMessage(): void {
    if (this.hubConnection.state === signalR.HubConnectionState.Connected && !!this.messageControl.value) {
      const sendMessage = new OutgoingMessage(this.chatRoom.workshopId, this.chatRoom.parentId, this.messageControl.value);
      this.hubConnection.invoke('SendMessageToOthersInGroupAsync', JSON.stringify(sendMessage));
      this.messageControl.setValue('');
    }
  }

  public onBack(): void {
    this.location.back();
  }

  public ngOnDestroy(): void {
    this.store.dispatch([new PopNavPath(), new ClearSelectedChatRoom(), new ResetProviderWorkshopDetails()]);
    this.hubConnection.stop();
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private getChatRoom(): void {
    this.mode = this.route.snapshot.queryParamMap.get('mode');

    switch (this.mode) {
      case ModeConstants.WORKSHOP:
        this.createChatRoom();
        break;
      default:
        const chatRoomId = this.route.snapshot.paramMap.get('id');
        this.store.dispatch(new GetChatRoomById(chatRoomId, this.userRole));
    }
  }

  private createChatRoom(): void {
    const workshopId = this.route.snapshot.paramMap.get('id');

    this.store.dispatch(new GetWorkshopById(workshopId));

    combineLatest([this.workshop$, this.user$, this.parent$])
      .pipe(
        filter(([workshop, user, parent]) => !!(workshop && user && parent)),
        takeUntil(this.destroy$)
      )
      .subscribe(([workshop, user, parent]) => {
        this.chatRoom = new ChatRoom(workshop, user, parent);
        this.messagesParameters.from = this.messages.length;
        this.store.dispatch(new GetChatRoomMessagesByWorkshopId(this.chatRoom.workshopId, this.messagesParameters));
        this.getChatMembersNames();
      });
  }

  private getChatMembersNames(): void {
    if (this.userIsProvider) {
      this.userName = this.chatRoom.workshop.title;
      this.companionName = Util.getFullName(this.chatRoom.parent);
    } else {
      this.userName = Util.getFullName(this.chatRoom.parent);
      this.companionName = this.chatRoom.workshop.title;
    }
  }

  private getUserRole(): void {
    this.userRole = this.store.selectSnapshot<Role>(RegistrationState.role);
    this.userIsProvider = this.userRole === Role.provider;
  }

  private createHubConnection(): void {
    this.hubConnection = this.signalRService.startConnection(CHAT_HUB_URL);

    this.hubConnection.on('ReadChatMessagesByUser', (readMessageIds: string) => {
      const parsedReadMessageIds = JSON.parse(readMessageIds);
      parsedReadMessageIds.forEach((readMessageId: string) => {
        this.messages.find((message: IncomingMessage) => message.id === readMessageId).readDateTime = Date.now().toString();
      });
    });

    this.hubConnection.on('ReceiveMessageInChatGroup', (jsonMessage: string) => {
      //TODO: Resolve issue with capital letters in incoming object (backend)
      let parsedMessage = JSON.parse(jsonMessage);
      let message: IncomingMessage = {
        id: parsedMessage.Id,
        chatRoomId: parsedMessage.ChatRoomId,
        text: parsedMessage.Text,
        createdDateTime: parsedMessage.CreatedDateTime,
        senderRoleIsProvider: parsedMessage.SenderRoleIsProvider,
        readDateTime: parsedMessage.ReadDateTime
      };

      this.messages.push(message);
      this.scrollDown();
    });
  }

  private addNavPath(): void {
    this.store.dispatch(
      new PushNavPath({
        name: NavBarName.Chat,
        isActive: false,
        disable: true
      })
    );
  }

  private setChatSubscriptions(): void {
    this.chatRoom$.pipe(filter(Boolean), takeUntil(this.destroy$)).subscribe((chatRoom: ChatRoom) => {
      this.chatRoom = chatRoom;
      this.store.dispatch(new GetChatRoomMessages(this.chatRoom.id, this.userRole, this.messagesParameters));
      this.getChatMembersNames();
    });

    this.messages$
      .pipe(
        filter(Boolean),
        map((messages: IncomingMessage[]) => messages.reverse()),
        takeUntil(this.destroy$)
      )
      .subscribe((messages: IncomingMessage[]) => this.addMessages(messages));
  }

  private addMessages(messages: IncomingMessage[]): void {
    const isUserDown =
      this.chatEl.nativeElement.scrollTop === this.chatEl.nativeElement.scrollHeight - this.chatEl.nativeElement.clientHeight;

    if (this.isHistoryLoading) {
      this.messages = [...messages, ...this.messages];
      this.isHistoryLoading = false;
    } else {
      this.messages.push(...messages);
    }

    if (isUserDown) {
      this.scrollDown();
    }
  }

  private scrollDown(): void {
    //TODO: Replace setTimeout
    setTimeout(() => {
      this.chatEl.nativeElement.scrollTop = this.chatEl.nativeElement.scrollHeight;
    }, 200);
  }
}
