import { Component, Input } from '@angular/core';
import { Constants } from '../../../../../../shared/constants/constants';
import { IncomingMessage } from '../../../../../../shared/models/chat.model';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {
  readonly Constants = Constants;

  @Input() message: IncomingMessage;
  @Input() isFirstMessage: boolean;
  @Input() senderName: string;
  @Input() userIsProvider: boolean;
}
