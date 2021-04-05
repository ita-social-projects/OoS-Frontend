import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-provider-config',
  templateUrl: './provider-config.component.html',
  styleUrls: ['./provider-config.component.scss', 'validation.component.scss']
})
export class ProviderConfigComponent implements OnInit {
  isLinear = false;
  selectedLogos = [];
  orgFormGroup: FormGroup;
  addressFormGroup: FormGroup;
  photoFormGroup: FormGroup;
  ownerShipList = ['Державна', 'Комунальна', 'Приватна'];
  organizationTypeList = ['ФОП', 'Громадська організація', 'ТОВ', 'ПП', 'Заклад освіти', 'Інше'];
  valueOwnership = false;
  valueOrgType = false;

  constructor() {
  }

  ngOnInit(): void {
    this.orgFormGroup = new FormGroup({
      ownership: new FormControl(null, Validators.required),
      organizationType: new FormControl(null, Validators.required),
      orgFullName: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      orgShortName: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      ceoName: new FormControl(null, [Validators.required]),
      ceoBirthday: new FormControl(null, Validators.required),
      personalId: new FormControl(null, [Validators.required, Validators.maxLength(10), Validators.maxLength(8), Validators.pattern('^[0-9]*$')]),
      phone: new FormControl(380, [Validators.required, Validators.maxLength(10)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      webPage: new FormControl(null),
      facebook: new FormControl(null),
      instagram: new FormControl(null),
      ownerName: new FormControl(null, Validators.required),

    });
    this.addressFormGroup = new FormGroup({
      legalAddress: new FormGroup({
        region: new FormControl(null, Validators.required),
        city: new FormControl(null, Validators.required),
        district: new FormControl(null, Validators.required),
        street: new FormControl(null, Validators.required),
        building: new FormControl(null, Validators.required),
      }),
      actualAddress: new FormGroup({
        region: new FormControl(null, Validators.required),
        city: new FormControl(null, Validators.required),
        district: new FormControl(null, Validators.required),
        street: new FormControl(null, Validators.required),
        building: new FormControl(null, Validators.required),
      })
    });
    this.photoFormGroup = new FormGroup({
      photo: new FormControl(null),
      photos: new FormArray([]),
      text: new FormControl('', [Validators.maxLength(500), Validators.required]),
      personalInfoAgreement: new FormControl(false, Validators.requiredTrue),
      notRobot: new FormControl(false, Validators.requiredTrue)
    });
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
      this.selectedLogos.push(myReader.result);
    };
    return myReader.readAsDataURL(file);
  }

  showSelect(event): void {
    switch (event.target.getAttribute('formControlName')) {
      case 'ownership':
        this.valueOwnership = !this.valueOwnership;
        break;
      case 'organizationType':
        this.valueOrgType = !this.valueOrgType;
        break;
    }
  }

  setValue(value, controlName): void {
    switch (controlName.getAttribute('formControlName')) {
      case 'ownership':
        this.orgFormGroup.get('ownership').setValue(value);
        this.valueOwnership = !this.valueOwnership;
        break;
      case 'organizationType':
        console.log(controlName);
        this.orgFormGroup.get('organizationType').setValue(value);
        this.valueOrgType = !this.valueOrgType;
        break;
    }
  }
}

