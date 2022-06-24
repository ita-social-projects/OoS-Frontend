import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoResultCardComponent } from 'src/app/shared/components/no-result-card/no-result-card.component';
import { Achievement } from 'src/app/shared/models/achievement.model';

import { AchievementsComponent } from './achievements.component';

describe('AchievementsComponent', () => {
  let component: AchievementsComponent;
  let fixture: ComponentFixture<AchievementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AchievementsComponent,
        MockAchievementCardComponent,
        NoResultCardComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AchievementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
@Component({
  selector: 'app-achievement-card',
  template: '',
})
class MockAchievementCardComponent {
  @Input() achievements: Achievement[];
}