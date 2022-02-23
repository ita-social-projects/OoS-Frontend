import { CustomCarouselDirective } from './custom-carousel.directive';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
//import { CarouselComponent } from 'node_modules/angular-responsive-carousel'
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('CustomCarouselDirective', () => {
  let testComponent: MockCarouselComponent;
  let fixture: ComponentFixture<MockCarouselComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        IvyCarouselModule
      ],
      declarations: [ CustomCarouselDirective, MockCarouselComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockCarouselComponent);
    testComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = new CustomCarouselDirective(MockCarouselComponent);
    expect(directive).toBeTruthy();
  });
});

@Component({
  template: ``
})
class MockCarouselComponent {
  clearSelection(){}
}
