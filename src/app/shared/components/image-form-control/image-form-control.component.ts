import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment';
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
  @Input() public imgMaxAmount: number;
  @Input() public imageIdsFormControl: FormControl;
  @Input() public label: string;
  @Input() public cropperConfig: Cropper;

  @ViewChild('inputImage') public inputImage: ElementRef;

  public photoFormGroup: FormGroup;
  public gridCols: number;
  public mediumScreen = 500;
  public smallScreen = 366;
  public selectedImages: File[] = [];
  public decodedImages: DecodedImage[] = [];
  public touched = false;
  public disabled = false;

  public onChange: FilesToVoid;
  public onTouched: VoidToVoid;

  constructor(public dialog: MatDialog) {}

  public ngOnInit(): void {
    this.onResize(window);
    if (this.imageIdsFormControl?.value?.length) {
      this.activateEditMode();
    }
  }

  /**
   * This methods decodes the file for its correct displaying
   * @param file: File
   */
  public imageDecoder(file: Blob): void {
    const myReader = new FileReader();
    myReader.onload = (): void => {
      this.decodedImages.push(new DecodedImage(myReader.result as string, file as File));
    };
    return myReader.readAsDataURL(file);
  }

  /**
   * This method remove already added img from the list of images
   * @param string word
   */
  public onRemoveImg(img: DecodedImage): void {
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

  public fileChangeEvent(event: string): void {
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
      if (!this.disabled && image) {
        this.imageDecoder(image);
        this.selectedImages.push(image);
        this.onChange(this.selectedImages);
      }
      this.inputImage.nativeElement.value = '';
    });
  }
}
