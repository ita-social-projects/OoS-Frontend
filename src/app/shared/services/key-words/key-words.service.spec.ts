import { TestBed } from '@angular/core/testing';

import { KeyWordsService } from './key-words.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('KeyWordsService', () => {
  let service: KeyWordsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
    });
    service = TestBed.inject(KeyWordsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
