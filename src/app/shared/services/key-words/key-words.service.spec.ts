import { TestBed } from '@angular/core/testing';

import { KeyWordsService } from './key-words.service';

describe('KeyWordsService', () => {
  let service: KeyWordsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeyWordsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
