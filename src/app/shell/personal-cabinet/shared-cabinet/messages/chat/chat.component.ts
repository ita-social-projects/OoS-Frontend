import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { filter, map, Observable, Subject, takeUntil } from 'rxjs';
import { GetChatRoomById, GetChatRoomMessages } from '../../../../../shared/store/chat.actions';
import { PopNavPath, PushNavPath } from '../../../../../shared/store/navigation.actions';
import { ChatRoom, Message, MessagesParameters } from '../../../../../shared/models/chat.model';
import { ChatState } from '../../../../../shared/store/chat.state';
import { NavBarName } from '../../../../../shared/enum/navigation-bar';
import { Location } from '@angular/common';
import { Role } from '../../../../../shared/enum/role';
import { RegistrationState } from '../../../../../shared/store/registration.state';
import { SignalRService } from '../../../../../shared/services/signalR/signal-r.service';
import { CHAT_HUB_URL } from '../../../../../shared/constants/hubs-Url';
import * as signalR from '@microsoft/signalr';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly Role = Role;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  private hubConnection: signalR.HubConnection;

  messages: Message[] = [];
  messagesParameters: MessagesParameters = {
    from: 0,
    size: 20
  };
  isMobileView: boolean;
  chatRoom: ChatRoom;
  userRole: Role;
  messageControl: FormControl = new FormControl('');
  isAdditionalMessageLoading = false;

  @Select(ChatState.selectedChatRoomMessages)
  messages$: Observable<Message[]>;
  @Select(ChatState.selectedChatRoom)
  chatRoom$: Observable<ChatRoom>;
  @Select(RegistrationState.role)
  role$: Observable<Role>;

  @ViewChild('chat') chatEl: ElementRef;

  @HostListener('window: resize', ['$event.target'])
  onResize(event: Window): void {
    this.isMobileView = event.outerWidth < 530;
  }

  constructor(private store: Store, private route: ActivatedRoute, private location: Location, private signalRService: SignalRService) {}

  ngOnInit(): void {
    this.addNavPath();
    this.getChatRoom();
    this.getUserRole();
    this.createHubConnection();
    this.addListeners();
    this.onResize(window);
  }

  ngAfterViewInit(): void {
    this.chatEl.nativeElement.onscroll = () => {
      if (this.chatEl.nativeElement.scrollTop < 10) {
        this.chatEl.nativeElement.scrollTop = 10;

        if (!this.isAdditionalMessageLoading) {
          this.isAdditionalMessageLoading = true;
          //TODO: replace hardcode data
          this.store.dispatch(
            new GetChatRoomMessages('08dabfe3-766c-40f9-8dca-f0b78fd26c26', this.userRole, { from: this.messages.length, size: 20 })
          );
        }
      }
    };
  }

  getChatRoom(): void {
    const chatRoomId = this.route.snapshot.queryParams['chatRoomId'];
    this.store.dispatch(new GetChatRoomById(chatRoomId));
  }

  getUserRole(): void {
    this.role$.pipe(takeUntil(this.destroy$)).subscribe((role: Role) => {
      this.userRole = role;
    });
  }

  createHubConnection(): void {
    this.hubConnection = this.signalRService.startConnection(CHAT_HUB_URL);

    this.hubConnection.on('ReceiveMessageInChatGroup', (jsonMessage: string) => {
      //TODO: Resolve issue with capital letters in incoming object
      let parsedMessage = JSON.parse(jsonMessage);
      let message: Message = {
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

  addNavPath(): void {
    this.store.dispatch(
      new PushNavPath({
        name: NavBarName.Chat,
        isActive: false,
        disable: true
      })
    );
  }

  addListeners(): void {
    this.chatRoom$
      .pipe(
        filter((chatRoom: ChatRoom) => !!chatRoom),
        takeUntil(this.destroy$)
      )
      .subscribe((chatRoom: ChatRoom) => {
        this.chatRoom = chatRoom;
        //TODO: replace hardcode data
        this.store.dispatch(new GetChatRoomMessages('08dabfe3-766c-40f9-8dca-f0b78fd26c26', this.userRole, this.messagesParameters));
      });

    this.messages$
      .pipe(
        filter((messages: Message[]) => !!messages),
        map((messages: Message[]) => messages.reverse()),
        takeUntil(this.destroy$)
      )
      .subscribe((messages: Message[]) => {
        let isUserDown =
          this.chatEl.nativeElement.scrollTop === this.chatEl.nativeElement.scrollHeight - this.chatEl.nativeElement.clientHeight;

        if (this.isAdditionalMessageLoading) {
          this.messages = [...messages, ...this.messages];
          this.isAdditionalMessageLoading = false;
        } else {
          this.messages.push(...messages);
        }

        if (isUserDown) {
          this.scrollDown();
        }
      });
  }

  sendMessage(): void {
    if (this.hubConnection.state === signalR.HubConnectionState.Connected && this.messageControl.value != '') {
      //TODO: replace hardcode data
      let sendMessage = {
        WorkshopId: '08da8a68-c234-489f-86b8-b67ecb4c0995',
        ParentId: '08da8cb9-2b6a-4593-862c-36d01bc894dc',
        Text: this.messageControl.value
      };

      this.hubConnection
        .invoke('SendMessageToOthersInGroupAsync', JSON.stringify(sendMessage))
        //TODO: replace hardcode data
        .then(() =>
          this.store.dispatch(new GetChatRoomMessages('08dabfe3-766c-40f9-8dca-f0b78fd26c26', this.userRole, { from: 0, size: 1 }))
        );
      this.messageControl.setValue('');
    }
  }

  scrollDown(): void {
    //TODO: Replace setTimeout
    setTimeout(() => {
      this.chatEl.nativeElement.scrollTop = this.chatEl.nativeElement.scrollHeight;
    }, 200);
  }

  onBack(): void {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.store.dispatch(new PopNavPath());
    this.hubConnection.stop();
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
