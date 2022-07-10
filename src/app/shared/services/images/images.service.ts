import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Constants } from '../../constants/constants';
import { CategoryIcons } from '../../enum/category-icons';
import { Provider } from '../../models/provider.model';
import { Workshop, WorkshopCard } from '../../models/workshop.model';
import { imgPath } from 'src/app/shared/models/carousel.model';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  constructor() { }

  setWorkshopCoverImage(workshop: WorkshopCard): WorkshopCard {
    workshop['_meta'] = workshop.coverImageId ?
    environment.storageUrl + workshop.coverImageId :
      CategoryIcons[workshop.directions[0]?.id];
    return workshop;
  }

  setCarouselImages(enityty: Workshop | Provider): imgPath[] {
    let images: imgPath[];

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
