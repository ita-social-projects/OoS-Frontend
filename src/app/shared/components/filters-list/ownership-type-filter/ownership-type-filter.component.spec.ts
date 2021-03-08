import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnershipTypeFilterComponent } from './ownership-type-filter.component';

describe('OwnershipTypeFilterComponent', () => {
  let component: OwnershipTypeFilterComponent;
  let fixture: ComponentFixture<OwnershipTypeFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnershipTypeFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnershipTypeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
