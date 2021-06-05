import { TestBed } from '@angular/core/testing';

import { TeacherService } from './teacher.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TeacherService', () => {
  let service: TeacherService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
    });
    service = TestBed.inject(TeacherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
