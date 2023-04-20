import { TestBed } from '@angular/core/testing';

import { BlockService } from './block.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BlockService', () => {
  let service: BlockService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(BlockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
