import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterTestingModule } from '@angular/router/testing';

import { TranslateModule } from '@ngx-translate/core';
import { Role } from 'shared/enum/role';
import { ChatRoom } from 'shared/models/chat.model';
import { ParentWithContactInfo } from 'shared/models/parent.model';
import { WorkshopTruncated } from 'shared/models/workshop.model';
import { EmptyValueTransformPipe } from 'shared/pipes/empty-value-transform.pipe';
import { GetFullNamePipe } from 'shared/pipes/get-full-name.pipe';
import { MessageCardComponent } from './message-card.component';

describe('MessageCardComponent', () => {
  let component: MessageCardComponent;
  let fixture: ComponentFixture<MessageCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MessageCardComponent, GetFullNamePipe, EmptyValueTransformPipe],
      imports: [HttpClientTestingModule, MatMenuModule, MatIconModule, MatCardModule, RouterTestingModule, TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MessageCardComponent);
    component = fixture.componentInstance;
    component.role = Role.provider;
    component.chatRoom = {
      parentId: 'parentId',
      parent: {} as ParentWithContactInfo,
      lastMessage: { createdDateTime: '' },
      workshop: {} as WorkshopTruncated
    } as ChatRoom;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit block when onBlock called', () => {
    jest.spyOn(component.block, 'emit');

    component.onBlock();

    expect(component.block.emit).toHaveBeenCalledWith(component.chatRoom.parentId);
  });

  it('should emit unblock when onBlock called', () => {
    jest.spyOn(component.unblock, 'emit');

    component.onUnblock();

    expect(component.unblock.emit).toHaveBeenCalledWith(component.chatRoom.parentId);
  });
});
