import { Directive } from '@angular/core';
import { Host, Self, Optional } from '@angular/core';
import { CarouselComponent } from 'node_modules/angular-responsive-carousel';

@Directive({
  selector: '[appCustomCarousel]'
})
export class CustomCarouselDirective {

  constructor(
    @Host() @Self() @Optional() public hostCarousel: CarouselComponent) {
    console.log('hostCarousel: ', hostCarousel);
    hostCarousel.isNextArrowDisabled = () => {
      if (hostCarousel.carousel) {
        hostCarousel.carousel.slide.isNextArrowDisabled = () => {
          return hostCarousel.carousel.slide.isLastSlide(hostCarousel.slide.counter) ||
          (!hostCarousel.carousel.slide.visibleCellsOverflowContainer && hostCarousel.carousel.slide.cellLength < hostCarousel.carousel.slide.numberOfVisibleCells) ||
          (hostCarousel.carousel.slide.visibleCellsOverflowContainer && hostCarousel.carousel.slide.cellLength < hostCarousel.carousel.slide.numberOfVisibleCells)
        }
        return hostCarousel.carousel.slide.isNextArrowDisabled();
      }
    }
  }
}
