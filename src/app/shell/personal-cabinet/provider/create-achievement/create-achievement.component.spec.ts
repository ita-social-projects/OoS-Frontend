import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAchievementComponent } from './create-achievement.component';

describe('CreateAchievementComponent', () => {
  let component: CreateAchievementComponent;
  let fixture: ComponentFixture<CreateAchievementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAchievementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAchievementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
