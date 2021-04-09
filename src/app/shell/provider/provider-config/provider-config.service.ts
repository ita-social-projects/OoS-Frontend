import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Injectable()
export class ProviderConfigService {

  constructor(
    private http: HttpClient,
    private token: OidcSecurityService,
  ) {
  }
}
