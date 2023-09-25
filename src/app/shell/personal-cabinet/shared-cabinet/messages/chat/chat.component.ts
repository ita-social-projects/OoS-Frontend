import { Location } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as signalR from '@microsoft/signalr';
import { Select, Store } from '@ngxs/store';
import { asyncScheduler, filter, map, Observable, Subject, takeUntil } from 'rxjs';

import { ModeConstants } from 'shared/constants/constants';
import { CHAT_HUB_URL } from 'shared/constants/hubs-Url';
import { ValidationConstants } from 'shared/constants/validation';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { Role } from 'shared/enum/role';
import { ChatRoom, IncomingMessage, MessagesParameters, OutgoingMessage } from 'shared/models/chat.model';
import { SignalRService } from 'shared/services/signalR/signal-r.service';
import {
  ClearSelectedChatRoom,
  GetChatRoomByApplicationId,
  GetChatRoomById,
  GetChatRoomForParentByWorkshopId,
  GetChatRoomMessagesById
} from 'shared/store/chat.actions';
import { ChatState } from 'shared/store/chat.state';
import { PopNavPath, PushNavPath } from 'shared/store/navigation.actions';
import { RegistrationState } from 'shared/store/registration.state';
import { ResetProviderWorkshopDetails } from 'shared/store/shared-user.actions';
import { Util } from 'shared/utils/utils';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly validationConstants = ValidationConstants;

  @ViewChild('chat')
  private chatEl: ElementRef;

  @Select(ChatState.selectedChatRoom)
  private chatRoom$: Observable<ChatRoom>;
  @Select(ChatState.selectedChatRoomMessages)
  private messages$: Observable<IncomingMessage[]>;

  private readonly scrollTopStep = 10;
  private messagesParameters: MessagesParameters = {
    from: 0,
    size: 20
  };
  public messages: IncomingMessage[] = [];
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

  private readonly onScroll = () => {
    if (this.chatEl.nativeElement.scrollTop < this.scrollTopStep) {
      this.chatEl.nativeElement.scrollTop = this.scrollTopStep;

      if (!this.isHistoryLoading) {
        this.isHistoryLoading = true;
        this.messagesParameters.from = this.messages.length;
        this.store.dispatch(new GetChatRoomMessagesById(this.userRole, this.chatRoom.id, this.messagesParameters));
      }
    }
  };

  constructor(private store: Store, private route: ActivatedRoute, private location: Location, private signalRService: SignalRService) {}

  public ngOnInit(): void {
    this.addNavPath();
    this.getUserRole();
    this.getChatRoom();
    this.createHubConnection();
  }

  public ngAfterViewInit(): void {
    this.setChatSubscriptions();
  }

  public ngOnDestroy(): void {
    this.store.dispatch([new PopNavPath(), new ClearSelectedChatRoom(), new ResetProviderWorkshopDetails()]);
    this.hubConnection.stop();
    this.destroy$.next(true);
    this.destroy$.unsubscribe();

    this.chatEl.nativeElement.removeEventListener('scroll', this.onScroll);
  }

  private setChatSubscriptions(): void {
    this.chatRoom$.pipe(filter(Boolean), takeUntil(this.destroy$)).subscribe((chatRoom: ChatRoom) => {
      this.chatRoom = chatRoom;
      this.store.dispatch(new GetChatRoomMessagesById(this.userRole, this.chatRoom.id, this.messagesParameters));
      this.getChatMembersNames();

      this.chatEl.nativeElement.addEventListener('scroll', this.onScroll);
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
    asyncScheduler.schedule(() => (this.chatEl.nativeElement.scrollTop = this.chatEl.nativeElement.scrollHeight), 200);
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

  private getUserRole(): void {
    this.userRole = this.store.selectSnapshot<Role>(RegistrationState.role);
    this.userIsProvider = this.userRole === Role.provider;
  }

  private getChatRoom(): void {
    const routeId = this.route.snapshot.paramMap.get('id');
    this.mode = this.route.snapshot.queryParamMap.get('mode');

    switch (this.mode) {
      case ModeConstants.WORKSHOP:
        this.store.dispatch(new GetChatRoomForParentByWorkshopId(routeId));
        break;
      case ModeConstants.APPLICATION:
        this.store.dispatch(new GetChatRoomByApplicationId(routeId));
        break;
      default:
        this.store.dispatch(new GetChatRoomById(this.userRole, routeId));
        break;
    }
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

  public onSendMessage(): void {
    if (this.hubConnection.state === signalR.HubConnectionState.Connected && !!this.messageControl.value) {
      const sendMessage = new OutgoingMessage(
        this.chatRoom.workshopId,
        this.chatRoom.parentId,
        this.chatRoom.id,
        this.messageControl.value
      );
      this.hubConnection.invoke('SendMessageToOthersInGroupAsync', JSON.stringify(sendMessage));
      this.messageControl.setValue('');
    }
  }

  public onBack(): void {
    this.location.back();
  }
}
