import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { MaterialModule } from 'shared/modules/material.module';
import { SharedModule } from 'shared/shared.module';
import { ApplicationCardComponent } from './applications/application-card/application-card.component';
import { ChildInfoBoxComponent } from './applications/application-card/child-info-box/child-info-box.component';
import { InfoStatusComponent } from './applications/application-card/info-status/info-status.component';
import { ApplicationsComponent } from './applications/applications.component';
import { ChatComponent } from './messages/chat/chat.component';
import { MessageComponent } from './messages/chat/message/message.component';
import { MessageCardComponent } from './messages/message-card/message-card.component';
import { MessagesComponent } from './messages/messages.component';

@NgModule({
  declarations: [
    ApplicationCardComponent,
    ApplicationsComponent,
    InfoStatusComponent,
    ChildInfoBoxComponent,
    MessagesComponent,
    MessageCardComponent,
    ChatComponent,
    MessageComponent
  ],
  imports: [MaterialModule, SharedModule, CommonModule, RouterModule, TranslateModule],
  exports: [ApplicationsComponent]
})
export class SharedCabinetModule {}
