import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { Constants } from '../../constants/constants';
import { Cropper } from '../../models/cropper';
import { DecodedImage } from '../../models/image.model';
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
export class ImageFormControlComponent implements OnInit, ImageFormControlComponent {
  photoFormGroup: FormGroup;
  gridCols: number;
  mediumScreen = 500;
  smallScreen = 366;
  selectedImages: File[] = [];
  decodedImages: DecodedImage[] = [];
  touched = false;
  disabled = false;

  onChange: FilesToVoid;
  onTouched: VoidToVoid;

  @Input() imgMaxAmount: number;
  @Input() imageIdsFormControl: FormControl;
  @Input() label: string;
  @Input() cropperConfig: Cropper;

  @ViewChild('inputImage') inputImage: ElementRef;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.onResize(window);
    (this.imageIdsFormControl && this.imageIdsFormControl.value?.length) && this.activateEditMode();
  }

  /**
   * This methods decodes the file for its correct displaying
   * @param file: File)
   */
  imageDecoder(file: Blob): void {
    const myReader = new FileReader();
    myReader.onload = () => {
      this.decodedImages.push(new DecodedImage(myReader.result, file));
    };
    return myReader.readAsDataURL(file);
  }

  /**
   * This method remove already added img from the list of images
   * @param string word
   */
  onRemoveImg(img: DecodedImage): void {
    this.markAsTouched();
    if (!this.disabled) {
      if (this.decodedImages.indexOf(img) >= 0) {
        const imageIndex = this.decodedImages.indexOf(img);
        this.decodedImages.splice(imageIndex, 1);
        if (img.imgFile) {
          this.selectedImages.splice(this.selectedImages.indexOf(img.imgFile), 1);
        }
        if (this.imageIdsFormControl) {
          this.imageIdsFormControl.value.splice(imageIndex, 1);
        }
        this.onChange(this.selectedImages);
      }
    }
  }

  activateEditMode(): void {
    this.imageIdsFormControl.value.forEach((imageId) => {
      this.decodedImages.push(new DecodedImage(environment.storageUrl + imageId, null));
    });
  }

  registerOnChange(onChange: FilesToVoid): void {
    this.onChange = onChange;
  }
  registerOnTouched(onTouched: VoidToVoid): void {
    this.onTouched = onTouched;
  }
  markAsTouched(): void {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }
  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  /* This method controls cols quantity in the img preview grid rows depending on screen width */
  onResize(screen: Window): void {
    if (screen.innerWidth >= this.mediumScreen) {
      this.gridCols = 4;
    } else if (screen.innerWidth < this.mediumScreen && screen.innerWidth >= this.smallScreen) {
      this.gridCols = 3;
    } else {
      this.gridCols = 2;
    }
  }

  fileChangeEvent(event: string): void {
    const dialogRef = this.dialog.open(ImageCropperModalComponent, {
      width: Constants.MODAL_MEDIUM,
      maxHeight: '95vh',
      height: 'auto',
      data: {
        image: event,
        cropperConfig: this.cropperConfig,
      }
    });

    dialogRef.afterClosed().subscribe((image: File)  => {
      this.markAsTouched();
      if (!this.disabled && image) {
        this.imageDecoder(image);
        this.selectedImages.push(image);
        this.onChange(this.selectedImages);
      }
      this.inputImage.nativeElement.value = '';
   });
  }
}
