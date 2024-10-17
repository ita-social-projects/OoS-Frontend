import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ImageCropperComponent } from 'ngx-image-cropper';

import { NgxsModule } from '@ngxs/store';
import { Cropper } from '../../models/cropper';
import { ImageCropperModalComponent } from './image-cropper-modal.component';

describe('ImageCropperModalComponent', () => {
  let component: ImageCropperModalComponent;
  let fixture: ComponentFixture<ImageCropperModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageCropperComponent, MatDialogModule, NgxsModule.forRoot()],
      declarations: [ImageCropperModalComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageCropperModalComponent);
    component = fixture.componentInstance;
    component.data.cropperConfig = {} as Cropper;
    component.data.cropperConfig.cropperAspectRatio = 1;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
