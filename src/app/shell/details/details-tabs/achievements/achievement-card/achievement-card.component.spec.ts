import { GetFullNamePipe } from './../../../../../shared/pipes/get-full-name.pipe';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { AchievementCardComponent } from './achievement-card.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Achievement } from '../../../../../shared/models/achievement.model';
import { TranslateModule } from '@ngx-translate/core';

describe('AchievementCardComponent', () => {
  let component: AchievementCardComponent;
  let fixture: ComponentFixture<AchievementCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        MatIconModule,
        MatCardModule,
        RouterTestingModule,
        MatDialogModule,
        MatTooltipModule,
        TranslateModule.forRoot(),
      ],
      declarations: [AchievementCardComponent, GetFullNamePipe],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AchievementCardComponent);
    component = fixture.componentInstance;
    component.achievement = {
      children: [],
      teachers: [],
    } as Achievement;
    component.isAllowedEdit;
    component.workshop;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
