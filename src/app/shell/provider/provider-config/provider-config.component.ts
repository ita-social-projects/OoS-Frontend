import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-provider-config',
  templateUrl: './provider-config.component.html',
  styleUrls: ['./provider-config.component.scss']
})
export class ProviderConfigComponent implements OnInit {
  isLinear = false;
  selectedLogos = [];
  orgFormGroup: FormGroup;
  addressFormGroup: FormGroup;
  photoFormGroup: FormGroup;



  constructor() {
  }

  ngOnInit(): void {

    this.orgFormGroup = new FormGroup({
      ownership: new FormControl(null, Validators.required),
      organizationType: new FormControl(null, Validators.required),
      orgFullName: new FormControl(null, Validators.required),
      orgShortName: new FormControl(null, Validators.required),
      ceoName: new FormControl(null, Validators.required),
      ceoBirthday: new FormControl(null, Validators.required),
      personalId: new FormControl(null, Validators.required),
      phone: new FormControl(null, Validators.required),
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
      photo: new FormControl(null, Validators.required),
      text: new FormControl(null, Validators.required)
    });
  }


  go(): void {
  }

  onFileSelected(event): any {
    this.readThis(event);
  }

  readThis(inputValue: any): any {
    const file: File = inputValue.target.files[0];
    const myReader: FileReader = new FileReader();
    myReader.onloadend = (e) => {
      this.selectedLogos.push(myReader.result);
    };

    myReader.readAsDataURL(file);
  }
}
