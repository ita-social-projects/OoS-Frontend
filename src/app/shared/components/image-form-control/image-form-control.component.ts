import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';

import { Constants } from 'shared/constants/constants';
import { Cropper } from 'shared/models/cropper';
import { DecodedImage } from 'shared/models/image.model';
import { ShowMessageBar } from 'shared/store/app.actions';
import { SnackbarText } from 'shared/enum/enumUA/message-bar';
import { environment } from '../../../../environments/environment';
import { ImageCropperModalComponent } from '../image-cropper-modal/image-cropper-modal.component';

type FilesToVoid = (array: File[]) => void;

@Component({
  selector: 'app-image-form-control',
  templateUrl: './image-form-control.component.html',
  styleUrls: ['./image-form-control.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: ImageFormControlComponent
    }
  ]
})
export class ImageFormControlComponent implements OnInit, ControlValueAccessor {
  @Input() public imgMaxAmount: number;
  @Input() public imageIdsFormControl: AbstractControl;
  @Input() public label: string;
  @Input() public cropperConfig: Partial<Cropper>;

  @ViewChild('inputImage') public inputImage: ElementRef;

  public gridCols: number;
  public mediumScreen = 500;
  public smallScreen = 366;
  public selectedImages: File[] = [];
  public decodedImages: DecodedImage[] = [];

  constructor(
    public dialog: MatDialog,
    private readonly changeDetection: ChangeDetectorRef,
    private readonly store: Store
  ) {}

  public ngOnInit(): void {
    this.onResize(window);
    if (this.imageIdsFormControl?.value?.length) {
      this.activateEditMode();
    }
  }

  public writeValue(images: File[]): void {
    if (images) {
      this.selectedImages = images;
      this.changeDetection.markForCheck();
    }
  }

  public registerOnChange(fn: FilesToVoid): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public onRemoveImg(img: DecodedImage): void {
    const imageIndex = this.decodedImages.indexOf(img);
    if (imageIndex >= 0) {
      const imageIdToRemove: string = this.decodedImages[imageIndex].image.split('/').at(-1);

      this.decodedImages.splice(imageIndex, 1);
      if (img.imgFile) {
        this.selectedImages.splice(this.selectedImages.indexOf(img.imgFile), 1);
      }

      this.onChange(this.selectedImages);
      this.updateImageIdsFormControl(imageIdToRemove);
      this.markAsTouched();
    }
  }

  public activateEditMode(): void {
    if (this.imageIdsFormControl?.value?.length) {
      this.imageIdsFormControl.value.forEach((imageId) => {
        this.decodedImages.push(new DecodedImage(environment.storageUrl + imageId, null));
      });
    }
  }

  public markAsTouched(): void {
    this.onTouched();
  }

  public onResize(screen: Window): void {
    if (screen.innerWidth >= this.mediumScreen) {
      this.gridCols = 4;
    } else if (screen.innerWidth < this.mediumScreen && screen.innerWidth >= this.smallScreen) {
      this.gridCols = 3;
    } else {
      this.gridCols = 2;
    }
  }

  public fileChangeEvent(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files?.[0]) {
      this.imageDecoder(target.files[0], (ev: ProgressEvent<FileReader>) => {
        const img = new Image();
        img.src = ev.target.result as string;
        img.onload = (): void => {
          const config = this.cropperConfig;
          if (img.width < config.cropperMinWidth || img.height < config.cropperMinHeight) {
            return this.handleImageError(SnackbarText.errorForSmallImg);
          }
          if (img.width > config.cropperMaxWidth || img.height > config.cropperMaxHeight) {
            return this.handleImageError(SnackbarText.errorForBigImg);
          }
          this.openCropperModal(event);
        };
      });
    }
  }

  public openCropperModal(event: Event): void {
    const dialogRef = this.dialog.open(ImageCropperModalComponent, {
      width: Constants.MODAL_MEDIUM,
      maxHeight: '95vh',
      height: 'auto',
      data: {
        image: event,
        cropperConfig: this.cropperConfig
      }
    });

    dialogRef.afterClosed().subscribe((image: File) => {
      this.markAsTouched();
      if (image) {
        this.imageDecoder(image, (ev: ProgressEvent<FileReader>) => {
          this.decodedImages.push(new DecodedImage(ev.target.result as string, image));
          this.changeDetection.markForCheck();
        });
        this.selectedImages.push(image);
        this.onChange(this.selectedImages);
      }
      this.inputImage.nativeElement.value = '';
    });
  }

  public imageDecoder(file: Blob, onLoad: (ev: ProgressEvent<FileReader>) => void): void {
    const myReader = new FileReader();
    myReader.onload = onLoad;
    myReader.readAsDataURL(file);
  }

  private updateImageIdsFormControl(imageId: string): void {
    const imgIds = [...this.imageIdsFormControl.value];
    const imgIndex: number = imgIds.indexOf(imageId);

    if (imgIndex !== -1) {
      imgIds.splice(imgIndex, 1);
      this.imageIdsFormControl.setValue(imgIds);
    }
  }

  private handleImageError(message: string): void {
    this.store.dispatch(
      new ShowMessageBar({
        message: message,
        type: 'error'
      })
    );
    this.inputImage.nativeElement.value = '';
  }

  private onChange: FilesToVoid = () => {};
  private onTouched: () => void = () => {};
}
