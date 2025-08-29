import { AfterViewInit, Component, Inject, Input, OnInit } from '@angular/core';
import { WINDOW } from 'ngx-window-token';
import { asyncScheduler } from 'rxjs';
import { OwlOptions } from 'ngx-owl-carousel-o';

import { ImgPath } from 'shared/models/carousel.model';
import { DefaultCarouselOptions } from 'shared/configs/carousel.config';
import { ImagesService } from 'shared/services/images/images.service';

@Component({
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.component.html',
  styleUrls: ['./image-carousel.component.scss']
})
export class ImageCarouselComponent implements OnInit, AfterViewInit {
  @Input() public images: ImgPath[];

  protected customOptions: OwlOptions = { ...DefaultCarouselOptions };

  constructor(
    private imageService: ImagesService,
    @Inject(WINDOW) private window: Window
  ) {}

  public ngOnInit(): void {
    if (this.images && this.images.length <= 1) {
      this.customOptions = {
        ...this.customOptions,
        loop: false,
        autoplay: false,
        nav: false,
        dots: false
      };
    }
  }

  public onImageError(event: Event): void {
    const imgEl = event.target as HTMLImageElement;
    imgEl.src = this.imageService.getDefaultCoverImage();
  }

  public ngAfterViewInit(): void {
    asyncScheduler.schedule(() => this.window.dispatchEvent(new Event('resize')));
  }
}
