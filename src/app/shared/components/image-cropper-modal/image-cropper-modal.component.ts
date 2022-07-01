import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageCroppedEvent, LoadedImage, base64ToFile } from 'ngx-image-cropper';
import { CropperConfigurationConstants } from '../../constants/constants';
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
  imageHasMinimumRequirements: boolean = false;
  readonly cropperConfig = CropperConfigurationConstants;

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
  imageLoaded(image: LoadedImage): void {
    const { height, width } = image.original.size;   
    this.imageHasMinimumRequirements = (height <= this.cropperConfig.cropperMinHeight || width <= this.cropperConfig.cropperMinWidth) ?
      false :
      true;
  }

}
