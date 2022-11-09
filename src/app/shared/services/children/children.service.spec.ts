import { TestBed } from '@angular/core/testing';

import { ChildrenService } from './children.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxsModule } from '@ngxs/store';

describe('CildrenService', () => {
  let service: ChildrenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot([])]
    });
    service = TestBed.inject(ChildrenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
