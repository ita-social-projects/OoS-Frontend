import { Component, Input, OnInit } from '@angular/core';
import { Message } from 'src/app/shared/models/chat.model';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  @Input() message: Message;
  @Input() isFirstMessage: boolean;

  constructor() {
    this.message = {
      chatRoomId: '2',
      id: 'd',
      createdDateTime: '2022-11-03T09:03:16.870Z',
      text: 'Доброго дня! Я хотіла запитатись що потрібно мати з собою на перше заняття?',
      senderRoleIsProvider: false,
      readDateTime: 's'
    };
    this.isFirstMessage = true;
  }

  ngOnInit(): void {}
}
