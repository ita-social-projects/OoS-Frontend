import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabinetDataComponent } from './cabinet-data.component';

describe('CabinetDataComponent', () => {
  let component: CabinetDataComponent;
  let fixture: ComponentFixture<CabinetDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CabinetDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CabinetDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
