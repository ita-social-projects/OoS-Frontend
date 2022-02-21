import { Component, OnInit, Input, ViewChild, OnChanges, AfterViewInit, AfterViewChecked } from '@angular/core';
import { imgPath } from 'src/app/shared/models/carousel.model';

@Component({
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.component.html',
  styleUrls: ['./image-carousel.component.scss']
})
export class ImageCarouselComponent implements OnInit, AfterViewChecked, AfterViewInit, OnChanges {

  @Input() images:imgPath[] = [];
  @ViewChild('myCarousel', {static: false}) myCarousel;
  constructor() { }

  ngOnInit(): void {  
  }

  ngAfterViewChecked() {
    if (this.myCarousel.isNextArrowDisabled() && (this.myCarousel.images.length===2)) {
      console.log('After View Checked: ')
      console.log('this.myCarousel.isNextArrowDisabled: ', this.myCarousel.isNextArrowDisabled());
      this.myCarousel.slide.utils.carouselProperties.visibleWidth = this.myCarousel.slide.utils.carouselProperties.cellsElement.parentElement.clientWidth - 1;
      console.log('Code is changed successfully');
      console.log('this.myCarousel.isNextArrowDisabled(): ', this.myCarousel.isNextArrowDisabled());
    }
  }

  ngAfterViewInit() {
  //   console.log('AfterViewInit: ')
  //   console.log('this.myCarousel.isNextArrowDisabled(): ', this.myCarousel.isNextArrowDisabled());
  //   if (this.myCarousel.isNextArrowDisabled()) {
  //     this.myCarousel.slide.utils.carouselProperties.visibleWidth = this.myCarousel.slide.utils.carouselProperties.cellsElement.parentElement.clientWidth - 1;
  //     console.log('Code is changed successfully');
  //     console.log('this.myCarousel.isNextArrowDisabled(): ', this.myCarousel.isNextArrowDisabled());
  //   }
    
  //   console.log('(1) this.myCarousel.slide.isLastSlide: ', this.myCarousel.slide.isLastSlide(this.myCarousel.slide.counter));
  //   console.log('(2) !this.slide.visibleCellsOverflowContainer: ', !this.myCarousel.slide.visibleCellsOverflowContainer)
  //   console.log('(2) this.cellLength <= this.numberOfVisibleCells: ', this.myCarousel.slide.cellLength <= this.myCarousel.slide.numberOfVisibleCells)
  //   console.log('(3) this.slide.visibleCellsOverflowContainer: ', this.myCarousel.slide.visibleCellsOverflowContainer)
  //   console.log('(3) this.cellLength < this.numberOfVisibleCells: ', this.myCarousel.slide.cellLength < this.myCarousel.slide.numberOfVisibleCells)
  //   console.log('this.myCarousel.slide.utils.carouselProperties.cellsElement.parentElement.clientWidth: ', this.myCarousel.slide.utils.carouselProperties.cellsElement.parentElement.clientWidth);
  //   console.log(this.myCarousel);
  }

  ngOnChanges() {
    if (this.myCarousel) {
      console.log('OnChanges (if myCarousel is true): ');
      console.log('this.myCarousel.isNextArrowDisabled: ', this.myCarousel.isNextArrowDisabled());
      this.myCarousel.utils.carouselProperties.cellsElement.style.transform = 'none';
      this.myCarousel.dotsArr = Array(this.images.length).fill(1);

      // console.log('(1) this.myCarousel.slide.isLastSlide: ', this.myCarousel.slide.isLastSlide(this.myCarousel.slide.counter));
      // console.log('(2) !this.slide.visibleCellsOverflowContainer: ', !this.myCarousel.slide.visibleCellsOverflowContainer)
      // console.log('(2) this.cellLength <= this.numberOfVisibleCells: ', this.myCarousel.slide.cellLength <= this.myCarousel.slide.numberOfVisibleCells)
      // console.log('(3) this.slide.visibleCellsOverflowContainer: ', this.myCarousel.slide.visibleCellsOverflowContainer)
      // console.log('(3) this.cellLength <= this.numberOfVisibleCells: ', this.myCarousel.slide.cellLength < this.myCarousel.slide.numberOfVisibleCells)
      
      // if (!this.myCarousel.isNextArrowDisabled()) {
      //   console.log(this.myCarousel.elementRef.nativeElement.childNodes[2].childNodes[1].classList);
      //   this.myCarousel.elementRef.nativeElement.childNodes[2].childNodes[1].classList.remove("carousel-arrow-disabled");
      //   console.log(this.myCarousel.elementRef.nativeElement.childNodes[2].childNodes[1].classList);
      //   //this.myCarousel.carousel.slide.utils.carouselProperties.visibleWidth = 730;
      // }
    }
  }

}
