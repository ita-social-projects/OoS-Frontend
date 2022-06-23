import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Constants } from '../../constants/constants';
import { DecodedImage } from '../../models/image.model';
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

  @Input() imgMaxAmount: number;
  @Input() imageIdsFormControl: FormControl;
  @Input() label: string;

  constructor() { }

  ngOnInit(): void {
    this.onResize(window);
    (this.imageIdsFormControl && this.imageIdsFormControl.value?.length) && this.activateEditMode();
  }
  /**
   * This methods adds files from input to the list of selected files and pass them to imageDecoder
   * @param event
   */
  onFileSelected(event): void {
    this.markAsTouched();
    if (!this.disabled) {
      const maxNewImg = this.imgMaxAmount - this.decodedImages.length;
      for (let i = 0; i < event.target.files.length; i++) {
        if (i < maxNewImg) {
          this.imageDecoder(event.target.files[i]);
          this.selectedImages.push(event.target.files[i]);
        }
      }
      this.onChange(this.selectedImages);
    }
  }
  /**
   * This methods decodes the file for its correct displaying
   * @param file: File)
   */
  imageDecoder(file: any): void {
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
      this.decodedImages.push(new DecodedImage(environment.storageUrl + imageId, null))
    })
  }

  onChange = (array: File[]): void => { }
  onTouched = (): void => { }
  writeValue(array: File[]): void { }
  registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }
  registerOnTouched(onTouched: any): void {
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
  onResize(screen): void {
    if (screen.innerWidth >= this.mediumScreen) {
      this.gridCols = 4;
    } else if (screen.innerWidth < this.mediumScreen && screen.innerWidth >= this.smallScreen) {
      this.gridCols = 3;
    } else {
      this.gridCols = 2;
    }
  }
}
