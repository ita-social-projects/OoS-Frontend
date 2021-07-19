import {APP_INITIALIZER} from '@angular/core';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AuthModule, LogLevel, OidcConfigService, OpenIdConfiguration} from 'angular-auth-oidc-client';
import {HttpClientModule} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {LocalSessionManagerService} from '../services/local-session-manager/local-session-manager.service';

// export function configureAuth(oidcConfigService: OidcConfigService): Promise<OpenIdConfiguration[]> {
//     return oidcConfigService.withConfigs([{
//       useRefreshToken: true,
//       silentRenew: true,
//       silentRenewTimeoutInSeconds: 300,
//       clientId: 'angular',
//       authority: environment.stsServer,
//       responseType: 'code',
//       redirectUrl: window.location.origin,
//       postLogoutRedirectUri: window.location.origin,
//       scope: 'openid outofschoolapi.read offline_access',
//       logLevel: LogLevel.Error,
//     }]);
// }

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    AuthModule.forRoot({
      config: {
        useRefreshToken: true,
        silentRenew: true,
        silentRenewTimeoutInSeconds: 300,
        clientId: 'angular',
        authority: environment.stsServer,
        responseType: 'code',
        redirectUrl: window.location.origin,
        postLogoutRedirectUri: window.location.origin,
        scope: 'openid outofschoolapi.read offline_access',
        logLevel: LogLevel.Error,
        customParamsAuthRequest: {
          culture: 'uk'
        }
      }, storage: LocalSessionManagerService
    }),
    HttpClientModule
  ],
  providers: [
    LocalSessionManagerService,
    OidcConfigService,
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: configureAuth,
    //   deps: [OidcConfigService],
    //   multi: true,
    // },
  ],
  bootstrap: []
})
export class RegistrationModule {
}
