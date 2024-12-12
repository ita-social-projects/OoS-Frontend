import { Component, Input, OnInit } from '@angular/core';

import { OwlOptions } from 'ngx-owl-carousel-o';
import { ImgPath } from 'shared/models/carousel.model';
import { DefaultCarouselOptions } from 'shared/configs/carousel.config';

@Component({
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.component.html',
  styleUrls: ['./image-carousel.component.scss']
})
export class ImageCarouselComponent implements OnInit {
  @Input() public images: ImgPath[] = [];

  protected customOptions: OwlOptions = { ...DefaultCarouselOptions };

  public ngOnInit(): void {
    if (this.images.length <= 1) {
      this.customOptions = {
        ...this.customOptions,
        loop: false,
        autoplay: false,
        nav: false,
        dots: false
      };
    }
  }
}
