import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageCardComponent } from './message-card.component';

describe('MessageCardComponent', () => {
  let component: MessageCardComponent;
  let fixture: ComponentFixture<MessageCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
