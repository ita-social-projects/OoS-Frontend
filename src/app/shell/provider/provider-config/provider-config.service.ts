import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {OidcSecurityService} from 'angular-auth-oidc-client';
import {DatePipe} from '@angular/common';
import {Observable} from 'rxjs';


@Injectable()
export class ProviderConfigService {
  providerForm: {};

  constructor(
    private http: HttpClient,
    private token: OidcSecurityService,
    private datePipe: DatePipe) {
  }
  /**
   * Generating random value, for unnecessary fields for post request
   *
   *
   * @param length - The first param is number
   * @param Value - the second is string
   */

  makeRandomValue(length, Value): string {
    const result = [];
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789';
    if (Value === 'number') {
      characters = '123456789';
    }
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result.push(characters.charAt(Math.floor(Math.random() *
        charactersLength)));
    }
    return result.join('');
  }

  addNewProvider(orgInfo, address, photos): Observable<any> {
    this.providerForm = {...orgInfo, address, photos};
    return this.http.post('/Provider/Create', {
      "title": orgInfo.get('orgFullName').value,
      "shortTitle": orgInfo.get('orgShortName').value,
      "website": orgInfo.get('webPage').value,
      "facebook": orgInfo.get('facebook').value,
      "instagram": orgInfo.get('instagram').value,
      "description": photos.get('text').value,
      "mfo": this.makeRandomValue(6, 'number'),
      "edrpou": this.makeRandomValue(10, 'number'),
      "koatuu": this.makeRandomValue(10, 'number'),
      "inpp": orgInfo.get('personalId').value,
      "director": orgInfo.get('ceoName').value,
      "directorPosition": "director",
      "authorityHolder": orgInfo.get('ownerName').value,
      "directorBirthDay": this.datePipe.transform(orgInfo.get('ceoBirthday').value, 'yyyy-MM-dd'),
      "directorPhonenumber": (orgInfo.get('phone').value).slice(-9),
      "managerialBody": orgInfo.get('ownership').value,
      "ownership": 0,
      "type": 0,
      "form": "string",
      "profile": 0,
      "index": "string",
      "isSubmitPZ1": true,
      "attachedDocuments": "string",
      "addressId": 0,
      "userId": this.makeRandomValue(6, ''),
      "user": {
        "userName": this.makeRandomValue(6, ''),
        "normalizedUserName": this.makeRandomValue(6, ''),
        "email": this.makeRandomValue(6, '') + '@',
        "normalizedEmail": this.makeRandomValue(6, '') + '@',
        "emailConfirmed": true,
        "passwordHash": this.makeRandomValue(6, ''),
        "securityStamp": this.makeRandomValue(6, ''),
        "concurrencyStamp": this.makeRandomValue(6, ''),
        "phoneNumber": this.makeRandomValue(6, ''),
        "phoneNumberConfirmed": true,
        "twoFactorEnabled": true,
        "lockoutEnd": "2021-04-11T08:39:51.512Z",
        "lockoutEnabled": true,
        "accessFailedCount": 0,
        "creatingTime": "2021-04-11T08:39:51.512Z",
        "lastLogin": "2021-04-11T08:39:51.512Z"
      },
      "address": {
        "region": address.controls['legalAddress'].get('region').value,
        "district": address.controls['legalAddress'].get('district').value,
        "city": address.controls['legalAddress'].get('city').value,
        "street": address.controls['legalAddress'].get('street').value,
        "buildingNumber": address.controls['legalAddress'].get('building').value,
        "latitude": 2,
        "longitude": 4
      }
    });
  }
}
