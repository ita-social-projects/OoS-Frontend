import { Injectable } from '@angular/core';

import { environment } from '../../../../environments/environment';
import { CategoryIcons } from '../../enum/category-icons';
import { ImgPath } from '../../models/carousel.model';
import { Provider } from '../../models/provider.model';
import { Workshop, WorkshopBaseCard } from '../../models/workshop.model';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  // TODO: Update type for workshop
  public setWorkshopCoverImage(workshop: WorkshopBaseCard & any): WorkshopBaseCard {
    workshop._meta = workshop.coverImageId ? environment.storageUrl + workshop.coverImageId : CategoryIcons[workshop.directionIds[0]];
    return workshop;
  }

  public setCarouselImages(entity: Workshop | Provider): ImgPath[] {
    let images: ImgPath[];
    if (entity.imageIds?.length) {
      images = entity.imageIds.map((imgId: string) => ({ path: environment.storageUrl + imgId }));
    } else {
      images = [{ path: 'assets/images/groupimages/workshop-img.png' }];
    }

    return images;
  }
}
