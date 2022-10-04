import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CategoryIcons } from '../../enum/category-icons';
import { ImgPath } from '../../models/carousel.model';
import { Provider } from '../../models/provider.model';
import { ProviderWorkshopCard, Workshop, WorkshopCard } from '../../models/workshop.model';

@Injectable({
  providedIn: 'root',
})
export class ImagesService {
  constructor() {}

  setWorkshopCoverImage(workshop: WorkshopCard | ProviderWorkshopCard): WorkshopCard | ProviderWorkshopCard {
    workshop['_meta'] = workshop.coverImageId
      ? environment.storageUrl + workshop.coverImageId
      : CategoryIcons[workshop.directionIds[0]];
    return workshop;
  }

  setCarouselImages(enityty: Workshop | Provider): ImgPath[] {
    let images: ImgPath[];

    if (enityty.imageIds?.length) {
      images = enityty.imageIds.map((imgId: string) => {
        return { path: environment.storageUrl + imgId };
      });
    } else {
      images = [{ path: 'assets/images/groupimages/workshop-img.png' }];
    }

    return images;
  }
}
