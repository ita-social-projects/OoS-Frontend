import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';

import { Cropper } from 'shared/models/cropper';
import { Store } from '@ngxs/store';
import { ShowMessageBar } from 'shared/store/app.actions';

@Component({
  selector: 'app-image-cropper-modal',
  templateUrl: './image-cropper-modal.component.html',
  styleUrls: ['./image-cropper-modal.component.scss']
})
export class ImageCropperModalComponent {
  public croppedImage = '';
  public imageFile: Blob;
  public invalidMinRequirements = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      image: Event;
      cropperConfig: Cropper;
    },
    public dialogRef: MatDialogRef<ImageCropperModalComponent>,
    private store: Store
  ) {}

  public onConfirm(): void {
    this.dialogRef.close(this.imageFile);
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
    this.store.dispatch(new ShowMessageBar({ message: 'Failed to load image', type: 'error' }));
  }

  public cropperReady(): void {}
}
