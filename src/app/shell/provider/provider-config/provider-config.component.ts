import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { Store } from '@ngxs/store';
import { ChangePage } from 'src/app/shared/store/app.actions';

@Component({
  selector: 'app-provider-config',
  templateUrl: './provider-config.component.html',
  styleUrls: ['./provider-config.component.scss']
})
export class ProviderConfigComponent implements OnInit {
  providerForm = new FormGroup({
    organizationType: new FormControl('', Validators.required),
    fullName: new FormControl('', Validators.required),
    mobilePhone: new FormControl('+380', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    webSite: new FormControl(''),
    faceBook: new FormControl(''),
    instagram: new FormControl(''),
    description: new FormControl(''),
    address: new FormGroup({
      city: new FormControl('', Validators.required),
      street: new FormControl('', Validators.required),
      building: new FormControl('', Validators.required),
    }),
    edrpou: new FormControl('', Validators.required),
    user: new FormGroup({
      login: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    }),
    dataProcessingPermission: new FormControl('', Validators.required),
    robotCheck: new FormControl('', Validators.required)
  });

  constructor(private http: HttpClient, private store: Store) {
  }

  ngOnInit(): void {
    this.store.dispatch(new ChangePage(false));
    this.http.post('http://localhost:5000/Provider/Create', {
      "id": 0,
      "title": "string",
      "shortTitle": "string",
      "website": "string",
      "facebook": "string",
      "instagram": "string",
      "description": "string",
      "mfo": "string",
      "edrpou": "string",
      "koatuu": "string",
      "inpp": "string",
      "director": "string",
      "directorPosition": "string",
      "authorityHolder": "string",
      "directorBirthDay": "2021-03-11",
      "directorPhonenumber": "string",
      "managerialBody": "string",
      "ownership": 0,
      "type": 0,
      "form": "string",
      "profile": 0,
      "index": "string",
      "isSubmitPZ1": true,
      "attachedDocuments": "string",
      "addressId": 0,
      "userId": "string",
      "user": {
        "id": "string",
        "userName": "string",
        "normalizedUserName": "string",
        "email": "string",
        "normalizedEmail": "string",
        "emailConfirmed": true,
        "passwordHash": "string",
        "securityStamp": "string",
        "concurrencyStamp": "string",
        "phoneNumber": "string",
        "phoneNumberConfirmed": true,
        "twoFactorEnabled": true,
        "lockoutEnd": "2021-03-11T10:48:01.648Z",
        "lockoutEnabled": true,
        "accessFailedCount": 0,
        "creatingTime": "2021-03-11T10:48:01.648Z",
        "lastLogin": "2021-03-11T10:48:01.648Z"
      }
    })
      .subscribe(value => console.log(value));
    this.http.get('http://localhost:5000/Provider/GetProviders').subscribe(value => alert(value));
  }

  onSubmit(): void {
    console.log(this.providerForm);
  }
}
