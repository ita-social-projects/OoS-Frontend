import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { ChildDeclination, WorkshopDeclination } from 'src/app/shared/enum/enumUA/declinations/declination';
import { Role } from 'src/app/shared/enum/role';
import { ApplicationParameters } from 'src/app/shared/models/application.model';
import { Child } from 'src/app/shared/models/child.model';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { ProviderApplciationsComponent } from './provider-applciations.component';

describe('ProviderApplciationsComponent', () => {
  let component: ProviderApplciationsComponent;
  let fixture: ComponentFixture<ProviderApplciationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[ NgxsModule.forRoot([])],
      declarations: [ ProviderApplciationsComponent, ApplicationsMockComponent ]
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