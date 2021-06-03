import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryCheckBoxComponent } from './category-check-box.component';

describe('CategoryCheckBoxComponent', () => {
  let component: CategoryCheckBoxComponent;
  let fixture: ComponentFixture<CategoryCheckBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
<<<<<<< HEAD:src/app/shared/components/organization-card/organization-card.component.spec.ts
      declarations: [ OrganizationCardComponent ],
      schemas: [NO_ERRORS_SCHEMA]
=======
      declarations: [ CategoryCheckBoxComponent ]
>>>>>>> origin/develop:src/app/shared/components/filters-list/category-check-box/category-check-box.component.spec.ts
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryCheckBoxComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
