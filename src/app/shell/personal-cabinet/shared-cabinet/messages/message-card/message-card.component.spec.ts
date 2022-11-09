import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { ParentWithContactInfo } from '../../../../../shared/models/parent.model';
import { WorkshopTruncated } from '../../../../../shared/models/workshop.model';
import { GetFullNamePipe } from '../../../../../shared/pipes/get-full-name.pipe';
import { ChatRoom } from '../../../../../shared/models/chat.model';
import { MessageCardComponent } from './message-card.component';
import { MatIconModule } from '@angular/material/icon';

describe('MessageCardComponent', () => {
  let component: MessageCardComponent;
  let fixture: ComponentFixture<MessageCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MessageCardComponent, GetFullNamePipe],
      imports: [HttpClientTestingModule, MatMenuModule, MatIconModule]
    }).compileComponents();

    fixture = TestBed.createComponent(MessageCardComponent);
    component = fixture.componentInstance;
    component.chatRoom = {
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
