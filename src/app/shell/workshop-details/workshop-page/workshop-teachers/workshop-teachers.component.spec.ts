import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';

import { WorkshopTeachersComponent } from './workshop-teachers.component';

describe('WorkshopTeachersComponent', () => {
  let component: WorkshopTeachersComponent;
  let fixture: ComponentFixture<WorkshopTeachersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
<<<<<<< HEAD:src/app/shared/components/filters-list/categories-filter/categories-filter.component.spec.ts
      declarations: [ CategoriesFilterComponent ],
      imports: [NgxsModule.forRoot([])],
      schemas: [NO_ERRORS_SCHEMA]
=======
      declarations: [ WorkshopTeachersComponent ]
>>>>>>> origin/develop:src/app/shell/workshop-details/workshop-page/workshop-teachers/workshop-teachers.component.spec.ts
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopTeachersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
