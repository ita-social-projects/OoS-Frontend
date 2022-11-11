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
import { Parent } from '../../../../../shared/models/parent.model';
import { Workshop } from '../../../../../shared/models/workshop.model';
import { SharedUserState } from '../../../../../shared/store/shared-user.state';
import { GetWorkshopById } from '../../../../../shared/store/shared-user.actions';
import { User } from '../../../../../shared/models/user.model';

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
  @Select(SharedUserState.selectedWorkshop)
  workshop$: Observable<Workshop>;
  //TODO: Fix parent object formation from two objects
  @Select(RegistrationState.user)
  user$: Observable<User>;
  @Select(RegistrationState.parent)
  parent$: Observable<Parent>;
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
    this.getUserRole();
    this.getChatRoom();
    this.createHubConnection();
    this.onResize(window);
  }

  ngAfterViewInit(): void {
    this.makeChatSubscriptions();

    this.chatEl.nativeElement.onscroll = () => {
      if (this.chatEl.nativeElement.scrollTop < 10) {
        this.chatEl.nativeElement.scrollTop = 10;

        if (!this.isAdditionalMessageLoading) {
          this.isAdditionalMessageLoading = true;
          this.store.dispatch(new GetChatRoomMessages(this.chatRoom.id, this.userRole, { from: this.messages.length, size: 20 }));
        }
      }
    };
  }

  getChatRoom(): void {
    const mode = this.route.snapshot.queryParamMap.get('mode');

    switch (mode) {
      case 'companion':
        this.createChatRoom();
        break;
      default:
        const chatRoomId = this.route.snapshot.paramMap.get('id');
        this.store.dispatch(new GetChatRoomById(chatRoomId, this.userRole));
    }
  }

  createChatRoom(): void {
    const companionId = this.route.snapshot.paramMap.get('id');
    this.chatRoom = {
      id: null,
      parentId: null,
      workshopId: null,
      workshop: null,
      parent: null
    };

    this.store.dispatch(new GetWorkshopById(companionId));
    this.workshop$
      .pipe(
        filter((workshop: Workshop) => !!workshop),
        takeUntil(this.destroy$)
      )
      .subscribe((workshop: Workshop) => {
        this.chatRoom.workshop = workshop;
        this.chatRoom.workshopId = workshop.id;
      });

    this.user$
      .pipe(
        filter((user: User) => !!user),
        takeUntil(this.destroy$)
      )
      .subscribe((user: User) => {
        if (this.chatRoom.parentId) {
          user.id = this.chatRoom.parentId;
        }

        this.chatRoom.parent = user;
      });

    this.parent$
      .pipe(
        filter((parent: Parent) => !!parent),
        takeUntil(this.destroy$)
      )
      .subscribe((parent: Parent) => {
        if (this.chatRoom.parent) {
          this.chatRoom.parent.id = parent.id;
        }
        this.chatRoom.parentId = parent.id;
      });
  }

  getUserRole(): void {
    this.role$.pipe(takeUntil(this.destroy$)).subscribe((role: Role) => {
      this.userRole = role;
    });
  }

  createHubConnection(): void {
    this.hubConnection = this.signalRService.startConnection(CHAT_HUB_URL);
    //TODO: Add listener for read messages (backend)
    this.hubConnection.on('ReceiveMessageInChatGroup', (jsonMessage: string) => {
      //TODO: Resolve issue with capital letters in incoming object (backend)
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

  makeChatSubscriptions(): void {
    this.chatRoom$
      .pipe(
        filter((chatRoom: ChatRoom) => !!chatRoom),
        takeUntil(this.destroy$)
      )
      .subscribe((chatRoom: ChatRoom) => {
        this.chatRoom = chatRoom;
        this.store.dispatch(new GetChatRoomMessages(this.chatRoom.id, this.userRole, this.messagesParameters));
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
      let sendMessage = {
        WorkshopId: this.chatRoom.workshopId,
        ParentId: this.chatRoom.parentId,
        Text: this.messageControl.value
      };
      //TODO: Add the sender to the mailing list (backend)
      //TODO: Remove .then() after adding sender to mailing list
      this.hubConnection.invoke('SendMessageToOthersInGroupAsync', JSON.stringify(sendMessage)).then(() => {
        if (this.chatRoom.id) {
          this.store.dispatch(new GetChatRoomMessages(this.chatRoom.id, this.userRole, { from: 0, size: 1 }));
        } else {
          this.messages.push({
            id: '',
            chatRoomId: '',
            createdDateTime: Date.now().toString(),
            senderRoleIsProvider: this.userRole === Role.provider,
            text: this.messageControl.value
          });
        }
        this.messageControl.setValue('');
      });
      //TODO: Uncomment after deleting then
      //this.messageControl.setValue('');
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
