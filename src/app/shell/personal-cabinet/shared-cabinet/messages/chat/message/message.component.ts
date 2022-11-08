import { Component, Input, OnInit } from '@angular/core';
import { Role } from '../../../../../../shared/enum/role';
import { Message } from '../../../../../../shared/models/chat.model';
import { ParentWithContactInfo } from '../../../../../../shared/models/parent.model';
import { Workshop } from '../../../../../../shared/models/workshop.model';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  readonly Role = Role;

  @Input() message: Message;
  @Input() isFirstMessage: boolean;
  @Input() parent: ParentWithContactInfo;
  @Input() workshop: Workshop;
  @Input() userRole: Role;

  constructor() {}

  ngOnInit(): void {}
}
