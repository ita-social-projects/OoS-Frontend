import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageCroppedEvent, LoadedImage, base64ToFile } from 'ngx-image-cropper';
import { Cropper } from '../../models/cropper';

@Component({
  selector: 'app-image-cropper-modal',
  templateUrl: './image-cropper-modal.component.html',
  styleUrls: ['./image-cropper-modal.component.scss']
})
export class ImageCropperModalComponent {

  imageChangedEvent: string = '';
  croppedImage: string = '';
  imageFile: Blob;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    image: string,
    cropperConfig: Cropper,
  },
  public dialogRef: MatDialogRef<ImageCropperModalComponent>,) { }

  onConfirm(): void {
    this.dialogRef.close(this.imageFile);
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
      this.imageFile = base64ToFile(event.base64);
      this.croppedImage = event.base64;
  }

  loadImageFailed(): void {}
  cropperReady(): void {}
  imageLoaded(image: LoadedImage): void {}

}
