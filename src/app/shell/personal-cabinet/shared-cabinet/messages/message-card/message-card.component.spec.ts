import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ParentWithContactInfo } from '../../../../../shared/models/parent.model';
import { WorkshopTruncated } from '../../../../../shared/models/workshop.model';
import { GetFullNamePipe } from '../../../../../shared/pipes/get-full-name.pipe';
import { EmptyValueTransformPipe } from '../../../../../shared/pipes/empty-value-transform.pipe';
import { ChatRoom } from '../../../../../shared/models/chat.model';
import { MessageCardComponent } from './message-card.component';

describe('MessageCardComponent', () => {
  let component: MessageCardComponent;
  let fixture: ComponentFixture<MessageCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MessageCardComponent, GetFullNamePipe, EmptyValueTransformPipe],
      imports: [HttpClientTestingModule, MatMenuModule, MatIconModule, MatCardModule, RouterTestingModule]
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
