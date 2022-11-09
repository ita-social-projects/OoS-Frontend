import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { filter, Observable, Subject, takeUntil } from 'rxjs';
import {
  GetChatRoomById,
  GetChatRoomMessages
} from '../../../../../shared/store/chat.actions';
import {
  PopNavPath,
  PushNavPath
} from '../../../../../shared/store/navigation.actions';
import {
  ChatRoom,
  Message,
  MessagesParameters
} from '../../../../../shared/models/chat.model';
import { ChatState } from '../../../../../shared/store/chat.state';
import { NavBarName } from '../../../../../shared/enum/navigation-bar';
import { Location } from '@angular/common';
import { Role } from '../../../../../shared/enum/role';
import { RegistrationState } from '../../../../../shared/store/registration.state';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly Role = Role;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  messages: Message[];
  messagesParameters: MessagesParameters = {
    from: 0,
    size: 0
  };
  isMobileView: boolean;
  chatRoom: ChatRoom;
  userRole: Role;

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

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.addNavPath();
    this.getChatRoom();
    this.getUserRole();
    this.addListeners();
    this.onResize(window);
  }

  ngAfterViewInit(): void {
    //TODO: Replace setTimeout
    setTimeout(() => {
      this.chatEl.nativeElement.scrollTop =
        this.chatEl.nativeElement.scrollHeight;
    }, 100);
  }

  getChatRoom() {
    const chatRoomId = this.route.snapshot.queryParams['chatRoomId'];
    this.store.dispatch(new GetChatRoomById(chatRoomId));
  }

  getUserRole() {
    this.role$.pipe(takeUntil(this.destroy$)).subscribe((role: Role) => {
      this.userRole = role;
    });
  }

  addNavPath() {
    this.store.dispatch(
      new PushNavPath({
        name: NavBarName.Chat,
        isActive: false,
        disable: true
      })
    );
  }

  addListeners() {
    this.chatRoom$
      .pipe(
        filter((chatRoom: ChatRoom) => !!chatRoom),
        takeUntil(this.destroy$)
      )
      .subscribe((chatRoom: ChatRoom) => {
        this.chatRoom = chatRoom;
        this.store.dispatch(
          new GetChatRoomMessages(this.chatRoom.id, this.messagesParameters)
        );
      });
    this.messages$
      .pipe(
        filter((messages: Message[]) => !!messages),
        takeUntil(this.destroy$)
      )
      .subscribe((messages: Message[]) => {
        this.messages = messages;
      });
  }

  onBack() {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.store.dispatch(new PopNavPath());
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
