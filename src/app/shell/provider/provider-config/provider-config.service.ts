import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {OidcSecurityService} from 'angular-auth-oidc-client';
import {DatePipe} from '@angular/common';
import {Observable} from 'rxjs';
import {
  ProviderConfigAddress,
  ProviderConfigModel,
  ProviderConfigUser
} from './provider-config-model/provider-config.model';


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

  /**
   * Sending post request of new provider
   *
   *
   * @param orgInfo - The first param is Object
   * @param address - the second is Object
   * @param photos - the second is Object
   */
  addNewProvider(orgInfo, address, photos): Observable<object> {
    this.providerForm = {...orgInfo, address, photos};
    const value = new ProviderConfigModel(
      orgInfo.get('orgFullName').value,
      orgInfo.get('orgShortName').value,
      orgInfo.get('webPage').value,
      orgInfo.get('facebook').value,
      orgInfo.get('instagram').value,
      photos.get('text').value,
      this.makeRandomValue(6, 'number'),
      this.makeRandomValue(10, 'number'),
      this.makeRandomValue(10, 'number'),
      orgInfo.get('personalId').value,
      orgInfo.get('ceoName').value,
      'director',
      orgInfo.get('ownerName').value,
      this.datePipe.transform(orgInfo.get('ceoBirthday').value, 'yyyy-MM-dd'),
      (orgInfo.get('phone').value).slice(-9),
      orgInfo.get('ownership').value,
      0,
      0,
      'string',
      0,
      'string',
      true,
      'string',
      0,
      this.makeRandomValue(6, ''),
      new ProviderConfigUser(
        this.makeRandomValue(6, ''),
        this.makeRandomValue(6, ''),
        this.makeRandomValue(6, '') + '@',
        this.makeRandomValue(6, '') + '@',
        true,
        this.makeRandomValue(6, ''),
        this.makeRandomValue(6, ''),
        this.makeRandomValue(6, ''),
        this.makeRandomValue(6, ''),
        true,
        true,
        "2021-04-11T08:39:51.512Z",
        true,
        0,
        "2021-04-11T08:39:51.512Z",
        "2021-04-11T08:39:51.512Z"
      ),
      new ProviderConfigAddress(
        address.controls.legalAddress.get('region').value,
        address.controls.legalAddress.get('district').value,
        address.controls.legalAddress.get('city').value,
        address.controls.legalAddress.get('street').value,
        address.controls.legalAddress.get('building').value,
        2,
        4
      ));
    return this.http.post('/Provider/Create', value);
  }
}

