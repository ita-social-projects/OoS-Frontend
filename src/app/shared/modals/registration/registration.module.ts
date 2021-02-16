import { APP_INITIALIZER } from '@angular/core';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AuthModule, LogLevel, OidcConfigService } from 'angular-auth-oidc-client';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export function configureAuth(oidcConfigService: OidcConfigService): any {
 
  return () =>{ 
      oidcConfigService.withConfig({
        clientId: 'angular',
        stsServer: environment.stsServer,
        responseType: 'code',
        redirectUrl: window.location.origin,
        postLogoutRedirectUri: window.location.origin,
        scope: 'openid outofschoolapi.read',
        logLevel: LogLevel.Debug,})  
  }
    
}

@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    AuthModule.forRoot(),
    HttpClientModule
  ],
  providers: [
    OidcConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: configureAuth,
      deps: [OidcConfigService],
      multi: true,
    },
  ],
  bootstrap: []
})
export class RegistrationModule {
}
