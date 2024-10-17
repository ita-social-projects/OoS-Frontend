import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';

import { Constants } from 'shared/constants/constants';
import { Cropper } from 'shared/models/cropper';
import { DecodedImage } from 'shared/models/image.model';
import { ShowMessageBar } from 'shared/store/app.actions';
import { environment } from '../../../../environments/environment';
import { ImageCropperModalComponent } from '../image-cropper-modal/image-cropper-modal.component';

type FilesToVoid = (array: File[]) => void;
type VoidToVoid = () => void;

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
export class ImageFormControlComponent implements OnInit, ImageFormControlComponent, ControlValueAccessor {
  @Input() public imgMaxAmount: number;
  @Input() public imageIdsFormControl: AbstractControl;
  @Input() public label: string;
  @Input() public cropperConfig: Partial<Cropper>; // FIXME: Remove Partial type and fix the errors those are related with this Input
  @Output() public removeId = new EventEmitter();

  @ViewChild('inputImage') public inputImage: ElementRef;

  public photoFormGroup: FormGroup;
  public gridCols: number;
  public mediumScreen = 500;
  public smallScreen = 366;
  public selectedImages: File[] = [];
  public decodedImages: DecodedImage[] = [];
  public touched = false;
  public disabled = false;

  constructor(
    public dialog: MatDialog,
    private changeDetection: ChangeDetectorRef,
    private store: Store
  ) {}

  public onChange: FilesToVoid = () => {};
  public onTouched: VoidToVoid = () => {};

  public ngOnInit(): void {
    this.onResize(window);
    if (this.imageIdsFormControl?.value?.length) {
      this.activateEditMode();
    }
  }

  public imageDecoder(file: Blob, onLoad: (ev: ProgressEvent<FileReader>) => void): void {
    const myReader = new FileReader();
    myReader.onload = onLoad;
    return myReader.readAsDataURL(file);
  }

  public onRemoveImg(img: DecodedImage): void {
    this.markAsTouched();
    if (!this.disabled) {
      if (this.decodedImages.indexOf(img) >= 0) {
        const imageIndex = this.decodedImages.indexOf(img);
        this.removeId.emit(this.decodedImages[imageIndex].image.split('/').at(-1));
        this.decodedImages.splice(imageIndex, 1);
        if (img.imgFile) {
          this.selectedImages.splice(this.selectedImages.indexOf(img.imgFile), 1);
        }
        this.onChange(this.selectedImages);
      }
    }
  }

  public activateEditMode(): void {
    this.imageIdsFormControl.value.forEach((imageId) => {
      this.decodedImages.push(new DecodedImage(environment.storageUrl + imageId, null));
    });
  }

  public registerOnChange(onChange: FilesToVoid): void {
    this.onChange = onChange;
  }

  public registerOnTouched(onTouched: VoidToVoid): void {
    this.onTouched = onTouched;
  }

  public markAsTouched(): void {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  public setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  /* This method controls cols quantity in the img preview grid rows depending on screen width */
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
    this.imageDecoder(target.files[0], (ev: ProgressEvent<FileReader>) => {
      const img = new Image();
      img.src = ev.target.result as string;
      img.onload = (): void => {
        const config = this.cropperConfig;
        if (img.width < config.cropperMinWidth || img.height < config.cropperMinHeight) {
          this.store.dispatch(
            new ShowMessageBar({
              message: `Мінімальний розмір зображення: ${config.cropperMinWidth}px у ширину та ${config.cropperMinHeight}px у висоту.`,
              type: 'error'
            })
          );
          this.inputImage.nativeElement.value = '';
        } else if (img.width > config.cropperMaxWidth || img.height > config.cropperMaxHeight) {
          this.store.dispatch(
            new ShowMessageBar({
              message: `Максимальний розмір зображення: ${config.cropperMaxWidth}px у ширину та ${config.cropperMaxHeight}px у висоту.`,
              type: 'error'
            })
          );
          this.inputImage.nativeElement.value = '';
        } else {
          this.openCropperModal(event);
        }
      };
    });
  }

  public writeValue(_obj: unknown): void {}

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
          this.changeDetection.detectChanges();
        });
        this.selectedImages.push(image);
        this.onChange(this.selectedImages);
      }
      this.inputImage.nativeElement.value = '';
    });
  }
}
