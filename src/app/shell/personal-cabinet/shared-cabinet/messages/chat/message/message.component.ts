import { Component, Input, OnInit } from '@angular/core';
import { Constants } from '../../../../../../shared/constants/constants';
import { Message } from '../../../../../../shared/models/chat.model';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  readonly Constants = Constants;

  @Input() message: Message;
  @Input() isFirstMessage: boolean;
  @Input() senderName: string;
  @Input() userIsProvider: boolean;

  constructor() {}

  ngOnInit(): void {}
}
