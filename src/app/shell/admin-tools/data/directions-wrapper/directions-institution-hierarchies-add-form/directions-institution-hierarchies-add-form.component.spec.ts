import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectionsInstitutionHierarchiesAddFormComponent } from './directions-institution-hierarchies-add-form.component';

describe('DirectionsInstitutionHierarchiesAddFormComponent', () => {
  let component: DirectionsInstitutionHierarchiesAddFormComponent;
  let fixture: ComponentFixture<DirectionsInstitutionHierarchiesAddFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectionsInstitutionHierarchiesAddFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectionsInstitutionHierarchiesAddFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
