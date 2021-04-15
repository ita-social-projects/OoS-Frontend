import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProviderConfigService } from './provider-config.service';
import { ProviderConfigModalComponent } from './provider-config-modal/provider-config-modal.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-provider-config',
  templateUrl: './provider-config.component.html',
  styleUrls: ['./provider-config.component.scss', './../validation.component.scss']
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
  textValue = '';

  constructor(private providerConfigService: ProviderConfigService, private modal: MatDialog) {
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
      phone: new FormControl(null, [Validators.required, Validators.maxLength(10), Validators.minLength(10)]),
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

  /**
   * This method receives a from from image-input child component and assigns to the Photo FormGroup
   * @param FormGroup form 
   */
   onReceivePhotoFormArray (array: FormArray):void{
    //this.photoFormGroup.get('photos').setValue=array;
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

  /**
   * Getting value from custom select and setting it into controller
   *
   *
   * @param value - The first input is string
   * @param controlName - The second input is htmlElement
   */

  setValue(value: string, controlName: HTMLElement): void {
    switch (controlName.getAttribute('formControlName')) {
      case 'ownership':
        this.orgFormGroup.get('ownership').setValue(value);
        this.valueOwnership = !this.valueOwnership;
        break;
      case 'organizationType':
        this.orgFormGroup.get('organizationType').setValue(value);
        this.valueOrgType = !this.valueOrgType;
        break;
    }
  }

  /**
   * showing modal that asking permission to reset form
   *
   * @remarks
   * This method is part of the {@link ProviderConfigModalComponent }.
   *
   */
  formReset(): void {
    if (this.orgFormGroup.dirty || this.addressFormGroup.dirty || this.photoFormGroup.dirty) {
      const refModal = this.modal.open(ProviderConfigModalComponent);
      refModal.afterClosed().subscribe(value => {
        if (value) {
          this.orgFormGroup.reset();
          this.addressFormGroup.reset();
          this.photoFormGroup.reset();
          this.selectedLogos = [];
        }
      });
    }
  }
}


