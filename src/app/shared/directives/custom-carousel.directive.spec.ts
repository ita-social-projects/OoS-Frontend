import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarouselComponent } from 'angular-responsive-carousel';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { CustomCarouselDirective } from './custom-carousel.directive';

describe('CustomCarouselDirective', () => {
  it('should create an instance', () => {
    const directive = new CustomCarouselDirective({} as CarouselComponent);
    expect(directive).toBeTruthy();
  });
});
