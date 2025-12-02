import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxsModule } from '@ngxs/store';
import { AchievementsService } from './achievements.service';

describe('AchievementsService', () => {
  let service: AchievementsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot([])]
    });
    service = TestBed.inject(AchievementsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
