import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { NoResultCardComponent } from 'src/app/shared/components/no-result-card/no-result-card.component';
import { AchievementsComponent } from './achievements.component';

describe('AchievementsComponent', () => {
  let component: AchievementsComponent;
  let fixture: ComponentFixture<AchievementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({    
      imports: [
        NgxsModule.forRoot([]),
        MatIconModule,
        MatCardModule,
        RouterTestingModule
      ],  
      declarations: [
        AchievementsComponent,
        NoResultCardComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
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
  @Input() achievement: Achievement;
}
