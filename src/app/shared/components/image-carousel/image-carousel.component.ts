import { Component, Input } from '@angular/core';
import { ImgPath } from 'shared/models/carousel.model';

@Component({
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.component.html',
  styleUrls: ['./image-carousel.component.scss']
})
export class ImageCarouselComponent {
  @Input() public images: ImgPath[] = [];
}
