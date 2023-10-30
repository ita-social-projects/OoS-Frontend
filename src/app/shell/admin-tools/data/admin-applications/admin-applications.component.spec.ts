import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxsModule } from '@ngxs/store';

import { AdminApplicationsComponent } from './admin-applications.component';
import { ApplicationFilterParameters } from 'shared/models/application.model';
import { Child } from 'shared/models/child.model';
import { Workshop } from 'shared/models/workshop.model';
import { ChildDeclination, WorkshopDeclination } from 'shared/enum/enumUA/declinations/declination';
import { Role } from 'shared/enum/role';

describe('AdminApplicationsComponent', () => {
  let component: AdminApplicationsComponent;
  let fixture: ComponentFixture<AdminApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([]), MatDialogModule],
      declarations: [AdminApplicationsComponent, MockApplicationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminApplicationsComponent);
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
class MockApplicationsComponent {
  @Input() public applicationParams: ApplicationFilterParameters;
  @Input() public dropdownEntities: Child[] | Workshop[];
  @Input() public declination: ChildDeclination | WorkshopDeclination;
  @Input() public role: Role;
}
