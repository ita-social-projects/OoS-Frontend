import { Component, OnInit, Input, ChangeDetectorRef, ElementRef } from '@angular/core';
import { CarouselComponent } from 'node_modules/angular-responsive-carousel';

@Component({
  selector: 'app-custom-carousel',
  templateUrl: './custom-carousel.component.html',
})
export class CustomCarouselComponent extends CarouselComponent implements OnInit {
  
  constructor(
    elementRef: ElementRef, 
    ref: ChangeDetectorRef) {
    super(elementRef, ref);
  }
  
  ngOnInit(): void { }

  // isNextArrowDisabled() {
  //   return this.carousel.isLastSlide(this.counter) ||
  //   (!this.carousel.visibleCellsOverflowContainer && this.cellLength < this.carousel.numberOfVisibleCells) ||
  //   (this.carousel.visibleCellsOverflowContainer && this.cellLength < this.carousel.numberOfVisibleCells)
  // }

}
