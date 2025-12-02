import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BlockService } from './block.service';

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
