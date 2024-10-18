import { Component, Input, OnInit } from '@angular/core';
import { ImgPath } from 'shared/models/carousel.model';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.component.html',
  styleUrls: ['./image-carousel.component.scss']
})
export class ImageCarouselComponent implements OnInit {
  @Input() public images: ImgPath[] = [];

  protected customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    dots: true,
    nav: true,
    navText: ['<span class="material-icons">arrow_back_ios</span>', '<span class="material-icons">arrow_forward_ios</span>'],
    responsive: {
      0: {
        items: 1
      }
    }
  };

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
