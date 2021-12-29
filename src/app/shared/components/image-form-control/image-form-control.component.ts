import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
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
  decodedImages = [];
  touched = false;
  disabled = false;
  imgUrl = `https://api.oos.dmytrominochkin.cloud/api/v1/PublicImage/`;
  imgAmount: number = 0;

  @Input() imgMaxAmount: number;
  @Input() imageIdsFormControl: FormControl;
  @Input() label: string;

  constructor() { }

  ngOnInit(): void {
    this.onResize(window);
    this.imageIdsFormControl.value.length && this.activateEditMode();
  }
  /**
   * This methods adds files from input to the list of selected files and pass them to imageDecoder
   * @param event
   */
  onFileSelected(event): void {
    this.markAsTouched();
    if (!this.disabled) {
      if (typeof event.target.files[0].name === 'string') {
        for (let i = 0; i < event.target.files.length; i++) {
          if (this.selectedImages.length < this.imgMaxAmount) {
            this.imageDecoder(event.target.files[i]);
            this.selectedImages.push(event.target.files[i]);
          }
        }
        this.onChange(this.selectedImages);
      }
    }
    this.imgAmount = this.decodedImages.length;
  }
  /**
   * This methods decodes the file for its correct displaying
   * @param file: File)
   */
  imageDecoder(file: File): void {
    const myReader = new FileReader();
    myReader.onload = () => {
      if (this.decodedImages.length < this.imgMaxAmount) {
        this.decodedImages.push(myReader.result);
      }
    };
    return myReader.readAsDataURL(file);
  }
  /**
   * This method remove already added img from the list of images
   * @param string word
   */
  onRemoveImg(img: File | string): void {
    this.markAsTouched();
    if (!this.disabled) {
      if (this.decodedImages.indexOf(img) >= 0) {
        this.decodedImages.splice(this.decodedImages.indexOf(img), 1);
        if (typeof (img) === 'string') {
          this.imageIdsFormControl.value.splice(this.imageIdsFormControl.value.indexOf(img), 1);
        } else {
          this.selectedImages.splice(this.selectedImages.indexOf(img), 1);
          this.onChange(this.selectedImages);
        }
      }
    }
    this.imgAmount = this.decodedImages.length;
  }

  activateEditMode(): void {
    this.imgAmount = this.imageIdsFormControl.value.length;
    this.imageIdsFormControl.value.forEach((imageId) => {
      this.decodedImages.push(`${this.imgUrl + imageId}`)
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
