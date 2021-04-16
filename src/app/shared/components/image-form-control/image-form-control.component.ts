import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

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
export class ImageFormControlComponent implements OnInit {

  photoFormGroup: FormGroup;
  selectedImages: File[] = [];
  decodedImages = [];


  resultImageArray = [];
  touched = false;
  disabled = false;
  @Input() imgMaxAmount: number;
  @Input() label: string;
  @Output() passPhotoFormArray = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onFileSelected(event): void {
    this.markAsTouched();
    if (!this.disabled) {
      if (typeof event.target.files[0].name === 'string') {
        this.imageDecoder(event.target.files[0]);
        this.selectedImages.push(event.target.files[0]);
        this.onChange(this.selectedImages);
      }
    }
  }

  imageDecoder(file: File): void {
    const myReader = new FileReader();
    myReader.onload = () => {
      this.decodedImages.push(myReader.result);
    };
    return myReader.readAsDataURL(file);
  }
  /**
   * This method remove already added img from the list of images
   * @param string word
   */
  onRemoveImg(img: File): void {
    this.markAsTouched();
    if (!this.disabled) {
      if (this.decodedImages.indexOf(img) >= 0) {
        this.decodedImages.splice(this.decodedImages.indexOf(img), 1);
        this.selectedImages.splice(this.selectedImages.indexOf(img), 1);
        this.onChange(this.selectedImages);
      }
    }
  }

  writeValue(array: File[]) {
    this.resultImageArray = array;
  }

  onChange = (array: File[]) => { };

  onTouched = () => { };

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

}
