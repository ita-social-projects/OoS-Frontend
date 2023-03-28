import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectionsInstitutionHierarchiesEditFormComponent } from './directions-institution-hierarchies-edit-form.component';

describe('DirectionsInstitutionHierarchiesEditFormComponent', () => {
  let component: DirectionsInstitutionHierarchiesEditFormComponent;
  let fixture: ComponentFixture<DirectionsInstitutionHierarchiesEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectionsInstitutionHierarchiesEditFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectionsInstitutionHierarchiesEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
