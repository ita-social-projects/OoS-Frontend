import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';

import { NoResultCardComponent } from 'shared/components/no-result-card/no-result-card.component';
import { Achievement } from 'shared/models/achievement.model';
import { Workshop } from 'shared/models/workshop.model';
import { AchievementsComponent } from './achievements.component';

describe('AchievementsComponent', () => {
  let component: AchievementsComponent;
  let fixture: ComponentFixture<AchievementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([]), MatIconModule, MatCardModule, RouterTestingModule, MatDialogModule, TranslateModule.forRoot()],
      declarations: [AchievementsComponent, NoResultCardComponent, MockAchievementCardComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AchievementsComponent);
    component = fixture.componentInstance;
    component.achievements = [];
    component.workshop = {} as Workshop;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
@Component({
  selector: 'app-achievement-card',
  template: ''
})
class MockAchievementCardComponent {
  @Input() achievement: Achievement;
  @Input() workshop: Workshop;
  @Input() isAllowedEdit: boolean;
  @Input() achievementsTypes;
}
