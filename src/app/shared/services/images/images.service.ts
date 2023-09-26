import { Injectable } from '@angular/core';

import { environment } from '../../../../environments/environment';
import { CategoryIcons } from '../../enum/category-icons';
import { ImgPath } from '../../models/carousel.model';
import { Provider } from '../../models/provider.model';
import { WorkshopBaseCard, WorkshopV2 } from '../../models/workshop.model';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  constructor() {}

  setWorkshopCoverImage(workshop: WorkshopBaseCard): WorkshopBaseCard {
    workshop['_meta'] = workshop.coverImageId ? environment.storageUrl + workshop.coverImageId : CategoryIcons[workshop.directionIds[0]];
    return workshop;
  }

  setCarouselImages(entity: WorkshopV2 | Provider): ImgPath[] {
    let images: ImgPath[];

    if (entity.imageIds?.length) {
      images = entity.imageIds.map((imgId: string) => {
        return { path: environment.storageUrl + imgId };
      });
    } else {
      images = [{ path: 'assets/images/groupimages/workshop-img.png' }];
    }

    return images;
  }
}
