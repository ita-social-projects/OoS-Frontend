import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import localeUk from '@angular/common/locales/uk';
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_LEGACY_SELECT_CONFIG as MAT_SELECT_CONFIG } from '@angular/material/legacy-select';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsStoragePluginModule, StorageOption } from '@ngxs/storage-plugin';
import { NgxsModule, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { ErrorHandleInterceptor } from 'shared/interceptors/error-handle.interceptor';
import { RegistrationModule } from 'shared/modules/registration.module';
import { SharedModule } from 'shared/shared.module';
import { AdminState } from 'shared/store/admin.state';
import { AppState } from 'shared/store/app.state';
import { ChatState } from 'shared/store/chat.state';
import { FilterState } from 'shared/store/filter.state';
import { MainPageState } from 'shared/store/main-page.state';
import { MetaDataState } from 'shared/store/meta-data.state';
import { NavigationState } from 'shared/store/navigation.state';
import { NotificationState } from 'shared/store/notification.state';
import { ParentState } from 'shared/store/parent.state';
import { ProviderState } from 'shared/store/provider.state';
import { CheckAuth } from 'shared/store/registration.actions';
import { RegistrationState } from 'shared/store/registration.state';
import { SharedUserState } from 'shared/store/shared-user.state';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { ProgressBarComponent } from './header/progress-bar/progress-bar.component';
import { ShellComponent } from './shell/shell.component';
import { ShellModule } from './shell/shell.module';

registerLocaleData(localeUk);

@NgModule({
  declarations: [HeaderComponent, AppComponent, ShellComponent, FooterComponent, ProgressBarComponent],
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
      SharedUserState,
      AdminState,
      NavigationState,
      NotificationState,
      MainPageState,
      ProviderState,
      ParentState,
      ChatState
    ]),

    NgxsStoragePluginModule.forRoot({
      key: AppState,
      storage: StorageOption.SessionStorage
    }),
    NgxsReduxDevtoolsPluginModule.forRoot({
      disabled: environment.production
    }),
    NgxsLoggerPluginModule.forRoot({
      disabled: environment.production
    }),
    ShellModule,
    RegistrationModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'uk' },
    {
      provide: MAT_SELECT_CONFIG,
      useValue: { overlayPanelClass: 'custom-overlay-panel' }
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (store: Store) => (): Observable<unknown> => store.dispatch(new CheckAuth()),
      deps: [Store],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandleInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
