import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

import { MessageBarData } from 'shared/models/message-bar.model';
import { MessageBarComponent } from './message-bar.component';

describe('SnackBarComponent', () => {
  let component: MessageBarComponent;
  let fixture: ComponentFixture<MessageBarComponent>;
  let matSnackBar: MatSnackBar;
  let mockData: MessageBarData;

  beforeEach(async () => {
    mockData = {
      type: 'success',
      message: 'messageText',
      info: 'messageInfo',
      unclosable: false
    };

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

    expect(messageTextContainer.nativeElement.textContent.trim()).toBe('messageText');
  });

  it('should display error message when data type is error', () => {
    mockData.type = 'error';
    fixture.detectChanges();

    const errorContainer = fixture.debugElement.query(By.css('[data-testid="error-text"]'));

    expect(errorContainer).toBeTruthy();
    expect(errorContainer.nativeElement.textContent).toBe(' messageInfo ');
  });

  it('should not display error message when data type does not equal error', () => {
    mockData.type = 'success';
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

  it('should set tabindex="0" on the closing button', () => {
    fixture.detectChanges();
    const closingButton = fixture.debugElement.query(By.css('[data-testid="closing-button"]'));
    expect(closingButton.nativeElement.getAttribute('tabindex')).toBe('0');
  });

  it('should close the snackBar when Enter is pressed', () => {
    const snackBarDismissSpy = jest.spyOn(matSnackBar, 'dismiss');
    const closingButton = fixture.debugElement.query(By.css('[data-testid="closing-button"]'));

    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    closingButton.nativeElement.dispatchEvent(event);

    expect(snackBarDismissSpy).toHaveBeenCalledTimes(1);
  });

  it('should close the snackBar and prevent default behavior when Space is pressed', () => {
    const snackBarDismissSpy = jest.spyOn(matSnackBar, 'dismiss');
    const closingButton = fixture.debugElement.query(By.css('[data-testid="closing-button"]'));

    const event = new KeyboardEvent('keydown', { key: ' ' });
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

    closingButton.nativeElement.dispatchEvent(event);

    expect(snackBarDismissSpy).toHaveBeenCalledTimes(1);
    expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
  });

  it('should not display the closing button if data.unclosable is true', () => {
    mockData.unclosable = true;
    fixture.detectChanges();

    const closingButton = fixture.debugElement.query(By.css('[data-testid="closing-button"]'));
    expect(closingButton).toBeFalsy();
  });

  it('should apply the correct background color based on the message type', () => {
    mockData.type = 'success';
    fixture.detectChanges();

    const snackBarContainer = fixture.debugElement.query(By.css('.popup-body'));
    expect(snackBarContainer.nativeElement.classList).toContain('success');
  });
});
