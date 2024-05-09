import { Component, Injectable, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { NgxsModule, State, Store } from '@ngxs/store';

import { ChildDeclination, WorkshopDeclination } from 'shared/enum/enumUA/declinations/declination';
import { Role } from 'shared/enum/role';
import { ApplicationFilterParameters } from 'shared/models/application.model';
import { Child } from 'shared/models/child.model';
import { Workshop } from 'shared/models/workshop.model';
import { RegistrationStateModel } from 'shared/store/registration.state';
import { GetAllApplications } from 'shared/store/shared-user.actions';
import { AdminApplicationsComponent } from './admin-applications.component';

describe('AdminApplicationsComponent', () => {
  let component: AdminApplicationsComponent;
  let fixture: ComponentFixture<AdminApplicationsComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([MockRegistrationState]), MatDialogModule],
      declarations: [AdminApplicationsComponent, MockApplicationsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminApplicationsComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch GetAllApplications when onGetApplications called', () => {
    jest.spyOn(store, 'dispatch');

    component.onGetApplications();

    expect(store.dispatch).toHaveBeenCalledWith(new GetAllApplications(component.applicationParams));
  });
});

@Component({
  selector: 'app-applications',
  template: ''
})
class MockApplicationsComponent {
  @Input() public applicationParams: ApplicationFilterParameters;
  @Input() public dropdownEntities: Child[] | Workshop[];
  @Input() public declination: ChildDeclination | WorkshopDeclination;
  @Input() public role: Role;
}

@State<RegistrationStateModel>({
  name: 'registration',
  defaults: {
    role: Role.ministryAdmin
  } as RegistrationStateModel
})
@Injectable()
export class MockRegistrationState {}
