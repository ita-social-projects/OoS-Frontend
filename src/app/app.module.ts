import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon'
import { MatBadgeModule } from '@angular/material/badge';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { ShellModule } from './shell/shell.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppState } from './shared/store/app.state';
import { FilterState } from './shared/store/filter.state';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { environment } from 'src/environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';  
import { MatChipsModule } from '@angular/material/chips';

import { ShellComponent } from './shell/shell.component';
import { MetaDataState } from './shared/store/meta-data.state';
import { FooterComponent } from './footer/footer.component';
import { MaterialModule } from './shared/material/material.module';
import { RegistrationModule } from './shared/modals/registration/registration.module';
import { UserRegistrationState } from './shared/store/user-registration.state';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UserState } from './shared/store/user.state';
import { InterceptorProviders } from './shared/interceptors/interceptorProviders';



@NgModule({
  declarations: [
    HeaderComponent,
    AppComponent,
    ShellComponent,
    FooterComponent
  ],
  imports: [

    FormsModule,

    MatBadgeModule,
    MatMenuModule,
    MatIconModule,
    ReactiveFormsModule, 

    MatCardModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatChipsModule,

    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxsModule.forRoot([
      AppState,
      FilterState,
      MetaDataState,
      UserRegistrationState,
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
    
    MaterialModule,
    FormsModule,
    RegistrationModule,
    MatSnackBarModule
  ],
  providers: [
    InterceptorProviders,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
