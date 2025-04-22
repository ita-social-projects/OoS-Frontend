import { TestBed } from '@angular/core/testing';

import { WorkshopBaseCard } from 'shared/models/workshop.model';
import { CategoryIcons } from 'shared/enum/category-icons';
import { ImagesService } from './images.service';

describe('ImagesService', () => {
  let service: ImagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return default card image if directions and coverImage are undefined', () => {
    const workshop = {
      directionIds: [100]
    } as WorkshopBaseCard;

    expect(service.getDefaultWorkshopCardImage(workshop)).toEqual(CategoryIcons['0']);

    workshop.directionIds = [13];

    expect(service.getDefaultWorkshopCardImage(workshop)).toEqual(CategoryIcons[13]);
  });
});
