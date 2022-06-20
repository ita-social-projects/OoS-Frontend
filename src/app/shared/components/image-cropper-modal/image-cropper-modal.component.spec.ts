import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageCropperModalComponent } from './image-cropper-modal.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { MatDialogModule } from '@angular/material/dialog';

describe('ImageCropperModalComponent', () => {
  let component: ImageCropperModalComponent;
  let fixture: ComponentFixture<ImageCropperModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ImageCropperModule,
        MatDialogModule,
      ],
      declarations: [ 
        ImageCropperModalComponent,
       ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageCropperModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

// @Component({
//   selector: 'image-cropper',
//   template: ''
// })
// class MockPropertiesCropperComponent {
//   @Input() imageChangedEvent: string;
//   @Input() cropperMinWidth: string;
//   @Input() cropperMinHeight: string;
//   @Input() resizeToWidth: string;
//   @Input() resizeToHeight: string;
// }