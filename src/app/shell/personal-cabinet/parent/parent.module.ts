import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParentRoutingModule } from './parent-routing.module';
import { ParentConfigComponent } from './parent-config/parent-config.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpTokenInterceptor } from 'src/app/shared/interceptors/http-token.interceptor';
import { ChildFormComponent } from './parent-create-child/child-form/child-form.component'
import { ParentCreateChildComponent } from './parent-create-child/parent-create-child.component';
import { ChildCardComponent } from './parent-config/child-card/child-card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxsModule } from '@ngxs/store';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UserState } from 'src/app/shared/store/user.state';
@NgModule({
  declarations: [
    ParentConfigComponent,
    ChildCardComponent,
    ParentCreateChildComponent,
    ChildFormComponent,
  ],
  imports: [
    NgxsModule.forFeature([UserState]),
    CommonModule,
    NgxsModule,
    ParentRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    FlexLayoutModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true }
  ]

})
export class ParentModule { }
