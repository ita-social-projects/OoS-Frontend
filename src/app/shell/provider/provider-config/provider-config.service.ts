import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {OidcSecurityService} from 'angular-auth-oidc-client';
import {Subject} from "rxjs";

@Injectable()
export class ProviderConfigService{
  subject = new Subject();
constructor(private http: HttpClient, private token: OidcSecurityService) {

}

method(){
//   this.http.post('/Provider/Create',{
//     "id": 0,
//     "title": "string",
//     "shortTitle": "string",
//     "website": "string",
//     "facebook": "string",
//     "instagram": "string",
//     "description": "string",
//     "mfo": "string",
//     "edrpou": "string",
//     "koatuu": "string",
//     "inpp": "string",
//     "director": "string",
//     "directorPosition": "string",
//     "authorityHolder": "string",
//     "directorBirthDay": "2021-04-07",
//     "directorPhonenumber": "string",
//     "managerialBody": "string",
//     "ownership": 0,
//     "type": 0,
//     "form": "string",
//     "profile": 0,
//     "index": "string",
//     "isSubmitPZ1": true,
//     "attachedDocuments": "string",
//     "addressId": 0,
//     "userId": "string",
//     "user": {
//       "id": "string",
//       "userName": "string",
//       "normalizedUserName": "string",
//       "email": "string",
//       "normalizedEmail": "string",
//       "emailConfirmed": true,
//       "passwordHash": "string",
//       "securityStamp": "string",
//       "concurrencyStamp": "string",
//       "phoneNumber": "string",
//       "phoneNumberConfirmed": true,
//       "twoFactorEnabled": true,
//       "lockoutEnd": "2021-04-07T14:34:35.686Z",
//       "lockoutEnabled": true,
//       "accessFailedCount": 0,
//       "creatingTime": "2021-04-07T14:34:35.686Z",
//       "lastLogin": "2021-04-07T14:34:35.686Z"
//     },
//     "address": {
//       "id": 0,
//       "region": "string",
//       "district": "string",
//       "city": "string",
//       "street": "string",
//       "buildingNumber": "string",
//       "latitude": 0,
//       "longitude": 0
//     }
//   }).subscribe(value => console.log(value));
}

}
