import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-photo-form',
  templateUrl: './create-photo-form.component.html',
  styleUrls: ['./create-photo-form.component.scss']
})
export class CreatePhotoFormComponent implements OnInit {

  PhotoFormGroup: FormGroup;

  @Output() passPhotoFormGroup = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {
    this.PhotoFormGroup = this.formBuilder.group({
      image: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.passPhotoFormGroup.emit(this.PhotoFormGroup);
  }
}
