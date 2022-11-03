import { TestBed } from '@angular/core/testing';

import { AchievementsService } from './achievements.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AchievementsService', () => {
  let service: AchievementsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AchievementsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
