import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxsModule } from '@ngxs/store';
import { ReasonModalWindowComponent } from './../../../../shared/components/confirmation-modal-window/reason-modal-window/reason-modal-window.component';
import { ChildDeclination, WorkshopDeclination } from '../../../../shared/enum/enumUA/declinations/declination';
import { Role } from '../../../../shared/enum/role';
import { ApplicationParameters } from '../../../../shared/models/application.model';
import { Child } from '../../../../shared/models/child.model';
import { Workshop } from '../../../../shared/models/workshop.model';
import { CabinetDataComponent } from '../../shared-cabinet/cabinet-data.component';
import { ProviderComponent } from '../provider.component';
import { ProviderApplciationsComponent } from './provider-applciations.component';

describe('ProviderApplciationsComponent', () => {
  let component: ProviderApplciationsComponent;
  let fixture: ComponentFixture<ProviderApplciationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ NgxsModule.forRoot([]), MatDialogModule],
      declarations: [
        ProviderApplciationsComponent,
        ApplicationsMockComponent,
        ProviderComponent,
        CabinetDataComponent,
        ReasonModalWindowComponent 
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderApplciationsComponent);
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
  @Input() applicationParams: ApplicationParameters;
  @Input() dropdownEntities: Child[] | Workshop[];
  @Input() declination: ChildDeclination | WorkshopDeclination;
  @Input() role: Role;
}
