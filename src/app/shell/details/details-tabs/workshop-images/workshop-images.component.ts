import { Component, Input } from '@angular/core';
import { Workshop, WorkshopDraft } from 'shared/models/workshop.model';
import { Provider } from 'shared/models/provider.model';
import { Competition } from 'shared/models/competition.model';
import { ImgPath } from 'shared/models/carousel.model';
import { ImagesService } from 'shared/services/images/images.service';
import { NoResultsTitle } from 'shared/enum/enumUA/no-results';

@Component({
  selector: 'app-workshop-images',
  templateUrl: './workshop-images.component.html',
  styleUrls: ['./workshop-images.component.scss']
})
export class WorkshopImagesComponent {
  public images: ImgPath[];

  public readonly NoResultsTitle = NoResultsTitle;

  constructor(private imagesService: ImagesService) {}

  @Input()
  public set entity(entity: Workshop | WorkshopDraft | Provider | Competition) {
    this.images = this.imagesService.getCarouselImages(entity);
  }
}
