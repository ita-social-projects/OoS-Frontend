import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IvyCarouselModule } from 'angular-responsive-carousel';

import { ImageCarouselComponent } from './image-carousel.component';

describe('ImageCarouselComponent', () => {
  let component: ImageCarouselComponent;
  let fixture: ComponentFixture<ImageCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IvyCarouselModule],
      declarations: [ImageCarouselComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
