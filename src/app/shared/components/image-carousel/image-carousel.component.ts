import { Component, Input } from '@angular/core';
import { ImgPath } from 'shared/models/carousel.model';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.component.html',
  styleUrls: ['./image-carousel.component.scss']
})
export class ImageCarouselComponent {
  @Input() public images: ImgPath[] = [];

  customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    dots: true,
    responsive: {
      0: {
        items: 1
      }
    }
  };
}
