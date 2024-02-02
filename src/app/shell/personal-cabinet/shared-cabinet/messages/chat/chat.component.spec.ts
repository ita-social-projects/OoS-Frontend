import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MockOidcSecurityService } from '../../../../../shared/mocks/mock-services';
import { ChatRoom } from '../../../../../shared/models/chat.model';
import { ParentWithContactInfo } from '../../../../../shared/models/parent.model';
import { GetFullNamePipe } from '../../../../../shared/pipes/get-full-name.pipe';

import { ChatComponent } from './chat.component';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatComponent, GetFullNamePipe],
      imports: [
        RouterTestingModule,
        NgxsModule.forRoot([]),
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
    component.chatRoom = {
      parent: {
        lastName: '',
        firstName: '',
        middleName: ''
      } as ParentWithContactInfo
    } as ChatRoom;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
