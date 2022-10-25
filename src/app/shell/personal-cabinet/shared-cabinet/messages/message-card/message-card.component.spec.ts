import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { ParentWithContactInfo } from 'src/app/shared/models/parent.model';
import { WorkshopTruncated } from 'src/app/shared/models/workshop.model';
import { ChatRoom } from '../../../../../shared/models/chat.model';
import { MessageCardComponent } from './message-card.component';

describe('MessageCardComponent', () => {
  let component: MessageCardComponent;
  let fixture: ComponentFixture<MessageCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MessageCardComponent],
      imports: [HttpClientTestingModule, MatMenuModule]
    }).compileComponents();

    fixture = TestBed.createComponent(MessageCardComponent);
    component = fixture.componentInstance;
    component.chatroom = {
      parent: {} as ParentWithContactInfo,
      lastMessage: { createdDateTime: '' },
      workshop: {} as WorkshopTruncated
    } as ChatRoom;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
