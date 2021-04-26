import { TestBed } from '@angular/core/testing';
import { CardWorkshopsService } from './card-workshops.service';

describe('OrgCardsService', () => {
  let service: CardWorkshopsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardWorkshopsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
