import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MAT_SNACK_BAR_DATA, MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';

import { MessageBarComponent } from './message-bar.component';
import { MessageBar } from 'shared/models/messageBar.model';

describe('SnackBarComponent', () => {
  let component: MessageBarComponent;
  let fixture: ComponentFixture<MessageBarComponent>;
  let matSnackBar: MatSnackBar;
  let mockData: MessageBar = { 
    type: 'messageType', 
    message: 'messageText',
    info: 'messageInfo',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatIconModule, MatSnackBarModule, TranslateModule.forRoot()],
      declarations: [MessageBarComponent],
      providers: [{ provide: MAT_SNACK_BAR_DATA, useValue: mockData }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageBarComponent);
    component = fixture.componentInstance;
    matSnackBar = TestBed.inject(MatSnackBar);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct message', () => {
    const messageTextContainer = fixture.debugElement.query(By.css('[data-testid="message-text"]'));

    expect(messageTextContainer.nativeElement.textContent).toBe(' messageText ');
  });

  it('should display error message when data type is error', () => {
    mockData.type = 'error';
    fixture.detectChanges();
    const errorContainer = fixture.debugElement.query(By.css('[data-testid="error-text"]'));

    expect(errorContainer).toBeTruthy();
    expect(errorContainer.nativeElement.textContent).toBe('messageInfo');
  });  
  
  it('should not display error message when data type does not equal error', () => {
    mockData.type = '';
    fixture.detectChanges();
    const errorContainer = fixture.debugElement.query(By.css('[data-testid="error-text"]'));

    expect(errorContainer).toBeFalsy();
  });

  it('should close the snackBar message', () => {
    const snackBarDismissSpy = jest.spyOn(matSnackBar, 'dismiss');
    const closingButton = fixture.debugElement.query(By.css('[data-testid="closing-button"]'));

    closingButton.nativeElement.click();

    expect(snackBarDismissSpy).toHaveBeenCalledTimes(1);
  });
});
