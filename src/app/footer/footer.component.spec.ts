import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule, Store } from '@ngxs/store';

import { MessageBarComponent } from 'shared/components/message-bar/message-bar.component';
import { SharedModule } from 'shared/shared.module';
import { ClearMessageBar, ShowMessageBar } from 'shared/store/app.actions';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let store: Store;
  let mockMatSnackBar: MatSnackBar;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatSnackBarModule,
        SharedModule,
        NgxsModule.forRoot([]),
        TranslateModule.forRoot()
      ],
      declarations: [FooterComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    mockMatSnackBar = TestBed.inject(MatSnackBar);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('showSnackBar method', () => {
    const messagePayload = { message: 'test', type: 'success' };

    it('should show showSnackBar on action dispatch', () => {
      jest.spyOn(component, 'showSnackBar');

      component.ngOnInit();
      store.dispatch([new ShowMessageBar(messagePayload), new ClearMessageBar()]);

      expect(component.showSnackBar).toHaveBeenCalledWith(messagePayload);
    });

    it('should correctly call openFromComponent method with provided payload', () => {
      jest.spyOn(mockMatSnackBar, 'openFromComponent');

      component.showSnackBar(messagePayload);

      expect(mockMatSnackBar.openFromComponent).toHaveBeenCalledWith(MessageBarComponent, {
        duration: 5000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: messagePayload.type,
        data: messagePayload
      });
    });
  });
});
