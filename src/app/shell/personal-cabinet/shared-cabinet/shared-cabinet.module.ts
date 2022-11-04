import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { ApplicationsComponent } from './applications/applications.component';
import { ApplicationCardComponent } from './applications/application-card/application-card.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InfoStatusComponent } from './applications/application-card/info-status/info-status.component';
import { ChildInfoBoxComponent } from './applications/application-card/child-info-box/child-info-box.component';
import { MaterialModule } from '../../../shared/modules/material.module';
import { SharedModule } from '../../../shared/shared.module';
import { MessagesComponent } from './messages/messages.component';
import { MessageCardComponent } from './messages/message-card/message-card.component';
import { ChatComponent } from './messages/chat/chat.component';
import { MessageComponent } from './messages/chat/message/message.component';

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
  imports: [MaterialModule, SharedModule, CommonModule, FlexLayoutModule, RouterModule],
  exports: [ApplicationsComponent]
})
export class SharedCabinetModule {}
