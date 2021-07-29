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
import { FooterComponent } from './footer/footer.component';
import { RegistrationModule } from './shared/registration/registration.module';
import { RegistrationState } from './shared/store/registration.state';
import { SharedModule } from './shared/shared.module';
import { UserState } from './shared/store/user.state';
import { NavigationState } from './shared/store/navigation.state';

@NgModule({
  declarations: [
    HeaderComponent,
    AppComponent,
    ShellComponent,
    FooterComponent
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
      NavigationState
    ]),

    NgxsReduxDevtoolsPluginModule.forRoot({
      disabled: environment.production
    }),
    NgxsLoggerPluginModule.forRoot(),
    FlexLayoutModule,
    ShellModule,
    RegistrationModule,
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    localStorage.setItem("ui-culture", 'uk')
    localStorage.getItem("ui-culture")
  }
}
