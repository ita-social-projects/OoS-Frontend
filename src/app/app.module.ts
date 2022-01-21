import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { ShellModule } from './shell/shell.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppState } from './shared/store/app.state';
import { FilterState } from './shared/store/filter.state';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { environment } from './../environments/environment';
import { FormsModule } from '@angular/forms';
import { ShellComponent } from './shell/shell.component';
import { MetaDataState } from './shared/store/meta-data.state';
import { RegistrationModule } from './shared/modules/registration.module';
import { RegistrationState } from './shared/store/registration.state';
import { SharedModule } from './shared/shared.module';
import { UserState } from './shared/store/user.state';
import { NavigationState } from './shared/store/navigation.state';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeUk from '@angular/common/locales/uk';
import { AdminState } from './shared/store/admin.state';

registerLocaleData(localeUk);

@NgModule({
  declarations: [
    HeaderComponent,
    AppComponent,
    ShellComponent,
  ],
  imports: [
    SharedModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxsModule.forRoot([
      AppState,
      FilterState,
      MetaDataState,
      RegistrationState,
      UserState,
      AdminState,
      NavigationState
    ]),

    NgxsReduxDevtoolsPluginModule.forRoot({
      disabled: environment.production
    }),
    NgxsLoggerPluginModule.forRoot({
      disabled: environment.production
    }),
    FlexLayoutModule,
    ShellModule,
    RegistrationModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'uk' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    localStorage.setItem('ui-culture', 'uk');
  }
}
