import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StretchCellComponent } from './stretch-cell.component';

describe('StretchCellComponent', () => {
  let component: StretchCellComponent;
  let fixture: ComponentFixture<StretchCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StretchCellComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StretchCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
