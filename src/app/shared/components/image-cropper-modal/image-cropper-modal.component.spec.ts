import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageCropperModalComponent } from './image-cropper-modal.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
       ],
       providers: [
        { provide: MAT_DIALOG_DATA, useValue: {data: {cropperConfig: {cropperConfig:1}}} },
        { provide: MatDialogRef, useValue: {} }
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

// class MockCropperConfigComponent {
//   @Input() imageChangedEvent: string;
//   @Input() cropperMinWidth: number;
//   @Input() croppedWidth: number;
//   @Input() cropperAspectRatio: number;
// }