import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Store } from '@ngxs/store';

import { Cropper } from 'shared/models/cropper';
import { ShowMessageBar } from 'shared/store/app.actions';
import { SnackbarText } from 'shared/enum/enumUA/message-bar';

@Component({
  selector: 'app-image-cropper-modal',
  templateUrl: './image-cropper-modal.component.html',
  styleUrls: ['./image-cropper-modal.component.scss']
})
export class ImageCropperModalComponent {
  public croppedImage = '';
  public imageFile: Blob;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      image: Event;
      cropperConfig: Cropper;
    },
    public dialogRef: MatDialogRef<ImageCropperModalComponent>,
    private readonly store: Store
  ) {}

  public onConfirm(): void {
    this.dialogRef.close(this.imageFile);
  }

  public imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.objectUrl;
    this.imageFile = event.blob;
  }

  public loadImageFailed(): void {
    this.store.dispatch(new ShowMessageBar({ message: SnackbarText.errorToLoadImg, type: 'error' }));
  }

  public cropperReady(): void {}
}
