import { Component, Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { Cropper } from 'shared/models/cropper';

@Component({
  selector: 'app-image-cropper-modal',
  templateUrl: './image-cropper-modal.component.html',
  styleUrls: ['./image-cropper-modal.component.scss']
})
export class ImageCropperModalComponent {
  public imageChangedEvent = '';
  public croppedImage = '';
  public imageFile: Blob;
  public invalidMinRequirements = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      image: string;
      cropperConfig: Cropper;
    },
    public dialogRef: MatDialogRef<ImageCropperModalComponent>
  ) {}

  public onConfirm(): void {
    this.dialogRef.close(this.imageFile);
  }

  public fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  public imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.objectUrl;
    this.imageFile = event.blob;
  }

  public imageLoaded(image: LoadedImage): void {
    const { height, width } = image.original.size;
    this.invalidMinRequirements = height < this.data.cropperConfig.cropperMinHeight || width < this.data.cropperConfig.cropperMinWidth;
  }

  public loadImageFailed(): void {
    console.log('Failed');
  }

  public cropperReady(): void {}
}
