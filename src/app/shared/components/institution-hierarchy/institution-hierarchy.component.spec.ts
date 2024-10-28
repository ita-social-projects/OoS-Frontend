import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';
import { ChangeDetectorRef } from '@angular/core';

import { InstitutionHierarchyComponent } from './institution-hierarchy.component';

describe('InstitutionHierarchyComponent', () => {
  let component: InstitutionHierarchyComponent;
  let fixture: ComponentFixture<InstitutionHierarchyComponent>;
  let changeDetectorRef: ChangeDetectorRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatOptionModule,
        MatSelectModule,
        MatFormFieldModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        NgxsModule.forRoot([])
      ],
      declarations: [InstitutionHierarchyComponent, MockValidationHintHierarchyComponent],
      providers: [ChangeDetectorRef]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstitutionHierarchyComponent);
    component = fixture.componentInstance;
    changeDetectorRef = fixture.debugElement.injector.get(ChangeDetectorRef);
    jest.spyOn(changeDetectorRef, 'detectChanges').mockImplementation(() => {
      fixture.detectChanges();
    });
    component.instituitionIdFormControl = new FormControl();
    component.provider = {
      institution: ''
    } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call setEditMode when instituitionIdFormControl has a value', () => {
    component.instituitionIdFormControl = new FormControl('123'); // Define institution ID form control with a value
    component.instituitionHierarchyIdFormControl = new FormControl(); // Define the hierarchy ID form control to avoid undefined error
    const setEditModeSpy = jest.spyOn(component as any, 'setEditMode'); // Spy on private method

    component.ngOnInit(); // Manually call ngOnInit

    expect(setEditModeSpy).toHaveBeenCalled(); // Check if setEditMode was called
  });

  it('should not call setEditMode when instituitionIdFormControl has no value', () => {
    component.instituitionIdFormControl = new FormControl(null); // Define institution ID form control without a value
    component.instituitionHierarchyIdFormControl = new FormControl(); // Define the hierarchy ID form control to avoid undefined error
    const setEditModeSpy = jest.spyOn(component as any, 'setEditMode'); // Spy on private method

    component.ngOnInit(); // Manually call ngOnInit

    expect(setEditModeSpy).not.toHaveBeenCalled(); // Check if setEditMode was not called
  });
});

@Component({
  selector: 'app-validation-hint',
  template: ''
})
class MockValidationHintHierarchyComponent {
  @Input() validationFormControl: FormControl; // required for validation
  @Input() isTouched: boolean;
}
