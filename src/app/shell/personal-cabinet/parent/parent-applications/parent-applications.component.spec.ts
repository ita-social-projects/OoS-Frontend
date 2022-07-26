import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxsModule } from '@ngxs/store';
import { ChildDeclination } from 'src/app/shared/enum/enumUA/declinations/declination';
import { Role } from 'src/app/shared/enum/role';
import { ApplicationParameters } from 'src/app/shared/models/application.model';
import { Child } from 'src/app/shared/models/child.model';
import { CabinetDataComponent } from '../../shared-cabinet/cabinet-data.component';
import { ParentComponent } from '../parent.component';

import { ParentApplicationsComponent } from './parent-applications.component';

describe('ParentApplicationsComponent', () => {
  let component: ParentApplicationsComponent;
  let fixture: ComponentFixture<ParentApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[ NgxsModule.forRoot([]), MatDialogModule],
      declarations: [ 
        ParentApplicationsComponent, 
        ApplicationsMockComponent, 
        ParentComponent, 
        CabinetDataComponent,
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
@Component({
  selector: 'app-applications',
  template: ''
})

class ApplicationsMockComponent {
  @Input() applicationParams: ApplicationParameters;
  @Input() dropdownEntities: Child[];
  @Input() declination: ChildDeclination;
  @Input() role: Role;
}