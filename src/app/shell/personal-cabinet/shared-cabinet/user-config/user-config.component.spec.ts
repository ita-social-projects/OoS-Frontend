import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserConfigComponent } from './user-config.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { PhoneTransformPipe } from '../../../../shared/pipes/phone-transform.pipe';

describe('UserConfigComponent', () => {
  let component: UserConfigComponent;
  let fixture: ComponentFixture<UserConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([]), MatCardModule, MatIconModule, ReactiveFormsModule, MatDialogModule],
      declarations: [UserConfigComponent, PhoneTransformPipe]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
