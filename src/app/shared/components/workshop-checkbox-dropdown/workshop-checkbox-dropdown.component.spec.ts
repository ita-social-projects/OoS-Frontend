import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NgxsModule } from '@ngxs/store';
import { WorkshopCheckboxDropdownComponent } from './workshop-checkbox-dropdown.component';

describe('WorkshopCheckboxDropdownComponent', () => {
  let component: WorkshopCheckboxDropdownComponent;
  let fixture: ComponentFixture<WorkshopCheckboxDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule
      ],
      declarations: [WorkshopCheckboxDropdownComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopCheckboxDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
