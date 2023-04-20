import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { NgxsModule } from '@ngxs/store';
import { DirectionsInstitutionHierarchiesListComponent } from './directions-institution-hierarchies-list.component';

describe('DirectionsInstitutionHierarchiesListComponent', () => {
  let component: DirectionsInstitutionHierarchiesListComponent;
  let fixture: ComponentFixture<DirectionsInstitutionHierarchiesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([]), MatTableModule],
      declarations: [DirectionsInstitutionHierarchiesListComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DirectionsInstitutionHierarchiesListComponent);
    component = fixture.componentInstance;
    component.institution = {
      id: "id", 
      title: 'title',
      numberOfHierarchyLevels: 2
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
