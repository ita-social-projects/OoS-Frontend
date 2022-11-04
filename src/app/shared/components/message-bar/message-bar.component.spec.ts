import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

import { MessageBarComponent } from './message-bar.component';

describe('SnackBarComponent', () => {
  let component: MessageBarComponent;
  let fixture: ComponentFixture<MessageBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatIconModule, MatSnackBarModule],
      declarations: [MessageBarComponent],
      providers: [{ provide: MAT_SNACK_BAR_DATA, useValue: {} }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
