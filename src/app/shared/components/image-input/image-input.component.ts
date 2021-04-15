import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-image-input',
  templateUrl: './image-input.component.html',
  styleUrls: ['./image-input.component.scss']
})
export class ImageInputComponent implements OnInit {

  photoFormGroup: FormGroup;
  selectedImages = [];
  @Input() imgMaxAmount: number;
  @Input() label: string;
  @Output() passPhotoFormArray = new EventEmitter();

  constructor() { 
    this.photoFormGroup = new FormGroup({
      photo: new FormControl(null),
      photos: new FormArray([]),
    });
  }

  ngOnInit(): void {
    this.passPhotoFormArray.emit(this.photoFormGroup.get('photos'));
  }

  onFileSelected(event): void {
    (this.photoFormGroup.controls.photos as FormArray)
      .push(new FormControl(event.target.files[0]));
    if (typeof event.target.files[0].name === 'string') {
      this.imageDecoder(event.target.files[0]);
    }
  }

  imageDecoder(file: File): void {
    const myReader = new FileReader();
    myReader.onload = () => {
      this.selectedImages.push(myReader.result);
    };
    return myReader.readAsDataURL(file);
  }
  /**
   * This method remove already added img from the list of images
   * @param string word 
   */
  onRemoveImg( img: File):void{
    if (this.selectedImages.indexOf(img) >= 0) {
      this.selectedImages.splice(this.selectedImages.indexOf(img), 1);
      if(this.photoFormGroup.controls['photos'].value.length>1){
        this.photoFormGroup.controls['photos'].value.splice(this.photoFormGroup.controls['photos'].value.indexOf(img), 1);
      }else{
        this.photoFormGroup.controls['photos'].reset();
        console.log(this.photoFormGroup.controls['photos'].value)
      }
      
    }
  }

}
