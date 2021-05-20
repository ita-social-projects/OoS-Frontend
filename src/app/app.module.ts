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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ShellComponent } from './shell/shell.component';
import { MetaDataState } from './shared/store/meta-data.state';
import { FooterComponent } from './footer/footer.component';
import { RegistrationModule } from './shared/modals/registration/registration.module';
import { RegistrationState } from './shared/store/registration.state';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpErrorInterceptor } from './shared/interceptors/http-error.interceptor';
import { UserState } from './shared/store/user.state';

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
      UserState
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
    MatProgressSpinnerModule
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
