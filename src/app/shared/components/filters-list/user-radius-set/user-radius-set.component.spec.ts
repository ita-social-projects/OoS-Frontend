import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

import { UserRadiusSetComponent } from './user-radius-set.component';

describe('UserRadiusSetComponent', () => {
  let component: UserRadiusSetComponent;
  let fixture: ComponentFixture<UserRadiusSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        NgxsModule.forRoot([]),
        MatSnackBarModule,
        TranslateModule.forRoot(),
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        NgxSliderModule
      ],
      declarations: [UserRadiusSetComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UserRadiusSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
