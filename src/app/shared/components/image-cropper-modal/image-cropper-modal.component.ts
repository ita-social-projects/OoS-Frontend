import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageCroppedEvent, LoadedImage, base64ToFile } from 'ngx-image-cropper';

@Component({
  selector: 'app-image-cropper-modal',
  templateUrl: './image-cropper-modal.component.html',
  styleUrls: ['./image-cropper-modal.component.scss']
})
export class ImageCropperModalComponent implements OnInit, OnDestroy {

  imageChangedEvent: string = '';
  croppedImage: string = '';
  imageFile: Blob;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    image: string,
  },
  public dialogRef: MatDialogRef<ImageCropperModalComponent>,) { }

  ngOnInit(): void {
  }

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

  clearCropper(): void {
    this.imageChangedEvent = null;
    this.croppedImage = null;
    this.imageFile = null;
  }

  loadImageFailed(): void {}
  cropperReady(): void {}
  imageLoaded(image: LoadedImage): void {}

  ngOnDestroy(): void {
    this.clearCropper();
  }
}
