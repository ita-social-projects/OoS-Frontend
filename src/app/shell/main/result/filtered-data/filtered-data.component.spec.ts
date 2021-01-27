import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilteredDataComponent } from './filtered-data.component';

describe('FilteredDataComponent', () => {
  let component: FilteredDataComponent;
  let fixture: ComponentFixture<FilteredDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilteredDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilteredDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
