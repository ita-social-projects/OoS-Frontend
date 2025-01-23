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
  private readonly defaultCoverImage: string = 'assets/images/groupimages/workshop-img.png';

  public getWorkshopCardCoverImage(workshop: WorkshopBaseCard): string {
    return workshop.coverImageId ? environment.storageUrl + workshop.coverImageId : CategoryIcons[workshop.directionIds[0]];
  }

  public getCoverImage(entity: Workshop | Provider): string {
    return entity.coverImageId ? environment.storageUrl + entity.coverImageId : this.defaultCoverImage;
  }

  public getCarouselImages(entity: Workshop | Provider): ImgPath[] {
    let images: ImgPath[];
    if (entity.imageIds?.length) {
      images = entity.imageIds.map((imgId: string) => ({ path: environment.storageUrl + imgId }));
    }

    return images;
  }
}
