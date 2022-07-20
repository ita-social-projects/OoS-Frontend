import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxsModule } from '@ngxs/store';
import { ChildDeclination, WorkshopDeclination } from 'src/app/shared/enum/enumUA/declinations/declination';
import { Role } from 'src/app/shared/enum/role';
import { ApplicationParameters } from 'src/app/shared/models/application.model';
import { Child } from 'src/app/shared/models/child.model';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { CabinetDataComponent } from '../../shared-cabinet/cabinet-data.component';
import { ProviderComponent } from '../provider.component';
import { ProviderApplciationsComponent } from './provider-applciations.component';

describe('ProviderApplciationsComponent', () => {
  let component: ProviderApplciationsComponent;
  let fixture: ComponentFixture<ProviderApplciationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[ NgxsModule.forRoot([]), MatDialogModule],
      declarations: [ 
        ProviderApplciationsComponent, 
        ApplicationsMockComponent, 
        ProviderComponent, 
        CabinetDataComponent 
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderApplciationsComponent);
    component = fixture.componentInstance;
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