import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Constants } from 'src/app/shared/constants/constants';
import { Provider } from 'src/app/shared/models/provider.model';

@Component({
  selector: 'app-create-photo-form',
  templateUrl: './create-photo-form.component.html',
  styleUrls: ['./create-photo-form.component.scss']
})
export class CreatePhotoFormComponent implements OnInit {

  readonly constants: typeof Constants = Constants;

  PhotoFormGroup: FormGroup;

  @Input() provider: Provider;
  @Output() passPhotoFormGroup = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {
    this.PhotoFormGroup = this.formBuilder.group({
      image: new FormControl(''),
      description: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.provider && this.PhotoFormGroup.patchValue(this.provider, { emitEvent: false });
    this.passPhotoFormGroup.emit(this.PhotoFormGroup);
  }
}
