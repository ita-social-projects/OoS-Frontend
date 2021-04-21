import {NgModule} from '@angular/core';
import {GroupComponent} from './group.component';
import {AboutGroupComponent} from './group-pages/about-group/about-group.component';
import {MaterialModule} from '../../../shared/material/material.module';
import {AboutSchoolComponent} from './group-pages/about-school/about-school.component';
import {TeachersComponent} from './group-pages/teachers/teachers.component';
import {SchoolClassesComponent} from './group-pages/school-classes/school-classes.component';
import {GroupCommentsComponent} from './group-pages/group-comments/group-comments.component';
import {SideMenuComponent} from './group-pages/side-menu/side-menu.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../../shared/shared.module';
import {FormsModule} from '@angular/forms';
import {GroupDetailService} from '../../../shared/services/group-details/group-detail.service';


@NgModule({
  declarations: [
    GroupComponent,
    AboutGroupComponent,
    AboutSchoolComponent,
    TeachersComponent,
    SchoolClassesComponent,
    GroupCommentsComponent,
    SideMenuComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule
  ],
  providers: [
    MatDatepickerModule,
    FlexLayoutModule,
    GroupDetailService
  ]
})
export class GroupModule {
}
