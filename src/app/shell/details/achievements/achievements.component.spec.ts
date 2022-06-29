import { APP_BASE_HREF } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { NoResultCardComponent } from 'src/app/shared/components/no-result-card/no-result-card.component';
import { Achievement } from 'src/app/shared/models/achievement.model';
import { AchievementsComponent } from './achievements.component';

// const MockAchievement = {Achievement: typeof Achievement};
describe('AchievementsComponent', () => {
  let component: AchievementsComponent;
  let fixture: ComponentFixture<AchievementsComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({    
      imports: [
        NgxsModule.forRoot([]),
      ],  
      declarations: [
        AchievementsComponent,
        MockAchievementCardComponent,
        NoResultCardComponent,
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(AchievementsComponent);
    component = fixture.componentInstance;
    component.achievements = [];
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