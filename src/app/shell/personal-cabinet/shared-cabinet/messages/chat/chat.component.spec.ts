import { Injectable } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule, State } from '@ngxs/store';
import { OidcSecurityService } from 'angular-auth-oidc-client';

import { MockOidcSecurityService } from 'shared/mocks/mock-services';
import { GetFullNamePipe } from 'shared/pipes/get-full-name.pipe';
import { ChatStateModel } from 'shared/store/chat.state';
import { ChatComponent } from './chat.component';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatComponent, GetFullNamePipe],
      imports: [
        RouterTestingModule,
        NgxsModule.forRoot([MockChatState]),
        TranslateModule.forRoot(),
        MatIconModule,
        MatCardModule,
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [{ provide: OidcSecurityService, useValue: MockOidcSecurityService }]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handleKeyDown', () => {
    it('should send message on Enter key press', () => {
      jest.spyOn(component, 'onSendMessage');

      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        shiftKey: false
      });

      component.handleKeyDown(event);

      expect(component.onSendMessage).toHaveBeenCalled();
    });

    it('should not send message on Shift+Enter key press', () => {
      jest.spyOn(component, 'onSendMessage');

      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        shiftKey: true
      });

      component.handleKeyDown(event);

      expect(component.onSendMessage).not.toHaveBeenCalled();
    });
  });
});

@State<ChatStateModel>({
  name: 'chat',
  defaults: {
    isLoadingData: false,
    chatRooms: {
      entities: [
        {
          id: 'chatId1',
          isBlockedByProvider: false,
          parent: undefined,
          parentId: undefined,
          workshop: undefined,
          workshopId: 'workshopId1'
        },
        {
          id: 'chatId2',
          isBlockedByProvider: false,
          parent: undefined,
          parentId: undefined,
          workshop: undefined,
          workshopId: 'workshopId2'
        }
      ],
      totalAmount: 1
    },
    selectedChatRoom: {
      id: 'chatId1',
      isBlockedByProvider: false,
      parent: undefined,
      parentId: undefined,
      workshop: undefined,
      workshopId: 'workshopId1'
    },
    selectedChatRoomMessages: [
      {
        id: 'incomingMessageId',
        chatRoomId: 'chatRoomId1',
        createdDateTime: undefined,
        senderRoleIsProvider: false,
        text: 'text'
      }
    ],
    unreadMessagesCount: 2
  }
})
@Injectable()
class MockChatState {}
