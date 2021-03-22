import {NgModule} from '@angular/core';
import {GroupComponent} from './group.component';
import {AboutGroupComponent} from './group-pages/about-group/about-group.component';
import {MaterialModule} from '../../../shared/material/material.module';
import {AboutSchoolComponent} from './group-pages/about-school/about-school.component';
import {TeachersComponent} from './group-pages/teachers/teachers.component';
import {SchoolClassesComponent} from './group-pages/school-classes/school-classes.component';
import {GroupCommentsComponent} from './group-pages/group-comments/group-comments.component';

@NgModule({
  declarations: [
    GroupComponent,
    AboutGroupComponent,
    AboutSchoolComponent,
    TeachersComponent,
    SchoolClassesComponent,
    GroupCommentsComponent
  ],
  imports: [MaterialModule],
  providers: []
})
export class GroupModel{
}
