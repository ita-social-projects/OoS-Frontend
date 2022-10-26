import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRadiusSetComponent } from './user-radius-set.component';
import { NgxsModule } from '@ngxs/store';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('UserRadiusSetComponent', () => {
  let component: UserRadiusSetComponent;
  let fixture: ComponentFixture<UserRadiusSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([]), MatSnackBarModule],
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
