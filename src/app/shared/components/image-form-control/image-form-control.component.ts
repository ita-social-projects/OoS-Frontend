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

  touched = false;
  disabled = false;
  @Input() imgMaxAmount: number;
  @Input() label: string;

  constructor() { }

  ngOnInit(): void {
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
          this.imageDecoder(event.target.files[i]);
          this.selectedImages.push(event.target.files[i]);
        }
        this.onChange(this.selectedImages);
      }
    }
  }
  /**
   * This methods decodes the file for its correct displaying
   * @param event
   */
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

  onChange = (array: File[]) => { };
  onTouched = () => { };

  writeValue(array: File[]) {
  }
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
