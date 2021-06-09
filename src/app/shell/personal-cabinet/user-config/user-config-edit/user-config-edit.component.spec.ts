import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserConfigEditComponent } from './user-config-edit.component';

describe('UserConfigEditComponent', () => {
  let component: UserConfigEditComponent;
  let fixture: ComponentFixture<UserConfigEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserConfigEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserConfigEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
