import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Provider } from 'src/app/shared/models/provider.model';

@Component({
  selector: 'app-create-contacts-form',
  templateUrl: './create-contacts-form.component.html',
  styleUrls: ['./create-contacts-form.component.scss']
})
export class CreateContactsFormComponent implements OnInit {
  ActualAddressFormGroup: FormGroup;
  LegalAddressFormGroup: FormGroup;
  isSameAddressControl: FormControl = new FormControl(false);

  @Input() provider: Provider;
  @Output() passActualAddressFormGroup: EventEmitter<FormGroup> = new EventEmitter();
  @Output() passLegalAddressFormGroup: EventEmitter<FormGroup> = new EventEmitter();
  @Output() isSameAddress: EventEmitter<boolean> = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {
    this.LegalAddressFormGroup = this.formBuilder.group({
      street: new FormControl('', Validators.required),
      buildingNumber: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      district: new FormControl('', Validators.required),
      region: new FormControl('', Validators.required)
    });

    this.ActualAddressFormGroup = this.formBuilder.group({
      street: new FormControl('', Validators.required),
      buildingNumber: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      district: new FormControl('', Validators.required),
      region: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.passActualAddressFormGroup.emit(this.ActualAddressFormGroup);
    this.passLegalAddressFormGroup.emit(this.LegalAddressFormGroup);

    this.isSameAddressControl.valueChanges.subscribe((isSame: boolean) => {
      isSame ? this.ActualAddressFormGroup.patchValue(this.LegalAddressFormGroup.value) : this.ActualAddressFormGroup.reset();
      this.isSameAddress.emit(isSame);
    });
    if (this.provider) {
      this.LegalAddressFormGroup.patchValue(this.provider.legalAddress, { emitEvent: false });
      this.ActualAddressFormGroup.patchValue(this.provider.actualAddress, { emitEvent: false });
    }
  }
}
