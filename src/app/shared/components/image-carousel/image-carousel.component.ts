import { Component, OnInit, Input, ViewChild, OnChanges } from '@angular/core';
import { imgPath } from 'src/app/shared/models/carousel.model';

@Component({
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.component.html',
  styleUrls: ['./image-carousel.component.scss']
})
export class ImageCarouselComponent implements OnInit, OnChanges {

  @Input() images: imgPath[] = [];
  @ViewChild('myCarousel', {static: false}) myCarousel;
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    if (this.myCarousel) {
      this.myCarousel.utils.carouselProperties.cellsElement.style.transform = 'none';
      this.myCarousel.dotsArr = Array(this.images.length).fill(1);
    }
  }
}
