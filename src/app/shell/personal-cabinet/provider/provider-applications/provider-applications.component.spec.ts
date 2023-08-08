import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxsModule } from '@ngxs/store';

import { ReasonModalWindowComponent } from 'shared/components/confirmation-modal-window/reason-modal-window/reason-modal-window.component';
import { ChildDeclination, WorkshopDeclination } from 'shared/enum/enumUA/declinations/declination';
import { Role } from 'shared/enum/role';
import { ApplicationFilterParameters } from 'shared/models/application.model';
import { Child } from 'shared/models/child.model';
import { Workshop } from 'shared/models/workshop.model';
import { CabinetDataComponent } from '../../shared-cabinet/cabinet-data.component';
import { ProviderComponent } from '../provider.component';
import { ProviderApplicationsComponent } from './provider-applications.component';

describe('ProviderApplicationsComponent', () => {
  let component: ProviderApplicationsComponent;
  let fixture: ComponentFixture<ProviderApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([]), MatDialogModule],
      declarations: [
        ProviderApplicationsComponent,
        ApplicationsMockComponent,
        ProviderComponent,
        CabinetDataComponent,
        ReasonModalWindowComponent
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderApplicationsComponent);
    component = fixture.componentInstance;
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
  @Input() applicationParams: ApplicationFilterParameters;
  @Input() dropdownEntities: Child[] | Workshop[];
  @Input() declination: ChildDeclination | WorkshopDeclination;
  @Input() role: Role;
}
