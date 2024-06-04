import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogModule as MatDialogModule,
  MatLegacyDialogRef as MatDialogRef
} from '@angular/material/legacy-dialog';
import { ImageCropperModule } from 'ngx-image-cropper';
import { Cropper } from '../../models/cropper';
import { ImageCropperModalComponent } from './image-cropper-modal.component';

describe('ImageCropperModalComponent', () => {
  let component: ImageCropperModalComponent;
  let fixture: ComponentFixture<ImageCropperModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageCropperModule, MatDialogModule],
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
