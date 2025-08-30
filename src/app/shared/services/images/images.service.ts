import { Injectable } from '@angular/core';

import { Competition, CompetitionBaseCard } from 'shared/models/competition.model';
import { environment } from '../../../../environments/environment';
import { CategoryIcons } from '../../enum/category-icons';
import { ImgPath } from '../../models/carousel.model';
import { Provider } from '../../models/provider.model';
import { Workshop, WorkshopBaseCard, WorkshopDraftCard } from '../../models/workshop.model';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  private readonly defaultCoverImage: string = 'assets/images/groupimages/workshop-img.png';

  public getWorkshopCardCoverImage(workshop: WorkshopBaseCard): string {
    return workshop.coverImageId ? environment.storageUrl + workshop.coverImageId : this.getDefaultWorkshopCardImage(workshop);
  }

  public getDefaultWorkshopCardImage(workshop: WorkshopBaseCard | WorkshopDraftCard): string {
    return CategoryIcons[workshop.directionIds[0]] || CategoryIcons['0'];
  }

  public getCompetitionCardCoverImage(competition: CompetitionBaseCard): string {
    return competition.coverImageId ? environment.storageUrl + competition.coverImageId : this.defaultCoverImage;
  }

  public getCoverImage(entity: Workshop | Provider | Competition): string {
    return entity.coverImageId ? environment.storageUrl + entity.coverImageId : this.defaultCoverImage;
  }

  public getDefaultCoverImage(): string {
    return this.defaultCoverImage;
  }

  public getCarouselImages(entity: Workshop | Provider | Competition): ImgPath[] {
    if (entity.imageIds?.length) {
      return entity.imageIds.map((imgId: string) => ({ path: environment.storageUrl + imgId }));
    }
  }
}
