import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { filter, Observable, Subject, takeUntil } from 'rxjs';
import { GetChatRoomMessages } from 'src/app/shared/store/chat.actions';
import {
  ChatRoom,
  Message,
  MessagesParameters
} from '../../../../../shared/models/chat.model';
import { ChatState } from '../../../../../shared/store/chat.state';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject<boolean>();

  messages: Message[];
  messagesParameters: MessagesParameters = {
    from: 0,
    size: 0
  };

  @Select(ChatState.selectedChatRoomMessages)
  messages$: Observable<Message[]>;

  @Input() chatRoom: ChatRoom;

  @ViewChild('chat') chatEl: ElementRef;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(
      new GetChatRoomMessages(this.chatRoom.id, this.messagesParameters)
    );
    this.messages$
      .pipe(
        filter((messages: Message[]) => !!messages),
        takeUntil(this.destroy$)
      )
      .subscribe((messages: Message[]) => {
        this.messages = messages;
      });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.chatEl.nativeElement.scrollTop =
        this.chatEl.nativeElement.scrollHeight;
    }, 100);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
