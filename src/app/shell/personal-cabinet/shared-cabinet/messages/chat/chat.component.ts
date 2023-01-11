import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { combineLatest, filter, map, Observable, Subject, takeUntil } from 'rxjs';
import { ClearSelectedChatRoom, GetChatRoomById, GetChatRoomMessages } from '../../../../../shared/store/chat.actions';
import { PopNavPath, PushNavPath } from '../../../../../shared/store/navigation.actions';
import { ChatRoom, IncomingMessage, MessagesParameters, OutgoingMessage } from '../../../../../shared/models/chat.model';
import { ChatState } from '../../../../../shared/store/chat.state';
import { NavBarName } from '../../../../../shared/enum/navigation-bar';
import { Location } from '@angular/common';
import { Role } from '../../../../../shared/enum/role';
import { RegistrationState } from '../../../../../shared/store/registration.state';
import { SignalRService } from '../../../../../shared/services/signalR/signal-r.service';
import { CHAT_HUB_URL } from '../../../../../shared/constants/hubs-Url';
import * as signalR from '@microsoft/signalr';
import { FormControl } from '@angular/forms';
import { Parent } from '../../../../../shared/models/parent.model';
import { Workshop } from '../../../../../shared/models/workshop.model';
import { SharedUserState } from '../../../../../shared/store/shared-user.state';
import { GetWorkshopById } from '../../../../../shared/store/shared-user.actions';
import { User } from '../../../../../shared/models/user.model';
import { Util } from '../../../../../shared/utils/utils';
import { ModeConstants } from '../../../../../shared/constants/constants';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chat') chatEl: ElementRef;

  @Select(ChatState.selectedChatRoomMessages)
  messages$: Observable<IncomingMessage[]>;
  @Select(ChatState.selectedChatRoom)
  chatRoom$: Observable<ChatRoom>;
  @Select(SharedUserState.selectedWorkshop)
  workshop$: Observable<Workshop>;
  @Select(RegistrationState.user)
  user$: Observable<User>;
  @Select(RegistrationState.parent)
  parent$: Observable<Parent>;
  @Select(RegistrationState.role)
  role$: Observable<Role>;

  messages: IncomingMessage[] = [];
  messageControl: FormControl = new FormControl('');
  userIsProvider: boolean;
  userName: string;
  companionName: string;

  private messagesParameters: MessagesParameters = {
    from: 0,
    size: 20
  };
  private chatRoom: ChatRoom;
  private userRole: Role;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  private hubConnection: signalR.HubConnection;
  private isHistoryLoading = false;

  constructor(private store: Store, private route: ActivatedRoute, private location: Location, private signalRService: SignalRService) {}

  ngOnInit(): void {
    this.addNavPath();
    this.getUserRole();
    this.getChatRoom();
    this.createHubConnection();
  }

  ngAfterViewInit(): void {
    this.setChatSubscriptions();

    this.chatEl.nativeElement.onscroll = () => {
      if (this.chatEl.nativeElement.scrollTop < 10) {
        this.chatEl.nativeElement.scrollTop = 10;

        if (!this.isHistoryLoading) {
          this.isHistoryLoading = true;
          this.store.dispatch(new GetChatRoomMessages(this.chatRoom.id, this.userRole, { from: this.messages.length, size: 20 }));
        }
      }
    };
  }

  onSendMessage(): void {
    if (this.hubConnection.state === signalR.HubConnectionState.Connected && !!this.messageControl.value) {
      const sendMessage = new OutgoingMessage(this.chatRoom.workshopId, this.chatRoom.parentId, this.messageControl.value);
      this.hubConnection.invoke('SendMessageToOthersInGroupAsync', JSON.stringify(sendMessage));
      this.messageControl.setValue('');
    }
  }

  onBack(): void {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.store.dispatch([new PopNavPath(), new ClearSelectedChatRoom()]);
    this.hubConnection.stop();
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private getChatRoom(): void {
    const mode = this.route.snapshot.queryParamMap.get('mode');

    switch (mode) {
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
