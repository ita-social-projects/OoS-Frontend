import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRadiusSetComponent } from './user-radius-set.component';

describe('UserRadiusSetComponent', () => {
  let component: UserRadiusSetComponent;
  let fixture: ComponentFixture<UserRadiusSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserRadiusSetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRadiusSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
