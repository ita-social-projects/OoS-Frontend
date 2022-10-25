import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectionsInstitutionHierarchiesListComponent } from './directions-institution-hierarchies-list.component';

describe('DirectionsInstitutionHierarchiesListComponent', () => {
  let component: DirectionsInstitutionHierarchiesListComponent;
  let fixture: ComponentFixture<DirectionsInstitutionHierarchiesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectionsInstitutionHierarchiesListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectionsInstitutionHierarchiesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
