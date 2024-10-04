import { Component, Input } from '@angular/core';

import { Constants } from 'shared/constants/constants';
import { IncomingMessage } from 'shared/models/chat.model';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {
  @Input() public message: IncomingMessage;
  @Input() public isFirstMessage: boolean;
  @Input() public senderName: string;
  @Input() public userIsProvider: boolean;

  public readonly Constants = Constants;
}
