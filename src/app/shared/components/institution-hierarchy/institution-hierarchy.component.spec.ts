import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutionHierarchyComponent } from './institution-hierarchy.component';

describe('InstitutionHierarchyComponent', () => {
  let component: InstitutionHierarchyComponent;
  let fixture: ComponentFixture<InstitutionHierarchyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstitutionHierarchyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstitutionHierarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
