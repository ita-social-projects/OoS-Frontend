import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AbstractSecurityStorage, AuthModule, LogLevel } from 'angular-auth-oidc-client';
import { HttpClientModule } from '@angular/common/http';
import { LocalSessionManagerService } from '../services/local-session-manager/local-session-manager.service';
import { environment } from '../../../environments/environment';

@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    AuthModule.forRoot({
      storage: LocalSessionManagerService,
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
        // @ts-ignore: Object is possibly 'null'
        secureRoutes: [environment.stsServer],
      }, }),
    HttpClientModule
  ],
  providers: [{ provide: AbstractSecurityStorage, useClass: LocalSessionManagerService }],
  bootstrap: []
})
export class RegistrationModule {
}
