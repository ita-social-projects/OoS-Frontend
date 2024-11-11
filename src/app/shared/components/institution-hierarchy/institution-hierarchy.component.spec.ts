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
import { Store } from '@ngxs/store';

import { GetInstitutionHierarchyChildrenById } from '../../store/meta-data.actions';
import { HierarchyElement } from '../../models/institution.model';
import { InstitutionHierarchyComponent } from './institution-hierarchy.component';

describe('InstitutionHierarchyComponent', () => {
  let component: InstitutionHierarchyComponent;
  let fixture: ComponentFixture<InstitutionHierarchyComponent>;
  let changeDetectorRef: ChangeDetectorRef;
  let store: Store;

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
    store = TestBed.inject(Store);
    changeDetectorRef = fixture.debugElement.injector.get(ChangeDetectorRef);
    jest.spyOn(changeDetectorRef, 'detectChanges').mockImplementation(() => {
      fixture.detectChanges();
    });
    jest.spyOn(store, 'dispatch');
    component.instituitionIdFormControl = new FormControl();
    component.provider = {
      institution: ''
    } as any;
    component.hierarchyArray = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call setEditMode when instituitionIdFormControl has a value', () => {
    component.instituitionIdFormControl.setValue('123');
    component.instituitionHierarchyIdFormControl = new FormControl();
    const setEditModeSpy = jest.spyOn(component as any, 'setEditMode');

    component.ngOnInit();

    expect(setEditModeSpy).toHaveBeenCalled();
  });

  it('should not call setEditMode when instituitionIdFormControl has no value', () => {
    component.instituitionIdFormControl.setValue(null);
    component.instituitionHierarchyIdFormControl = new FormControl();
    const setEditModeSpy = jest.spyOn(component as any, 'setEditMode');

    component.ngOnInit();

    expect(setEditModeSpy).not.toHaveBeenCalled();
  });

  describe('onHierarchyLevelSelect', () => {
    beforeEach(() => {
      component.hierarchyArray = [
        { hierarchyLevel: 1, formControl: new FormControl('1') } as HierarchyElement,
        { hierarchyLevel: 2, formControl: new FormControl('2') } as HierarchyElement
      ];
    });

    it('should dispatch GetInstitutionHierarchyChildrenById with correct ID', () => {
      const hierarchy = { hierarchyLevel: 2, formControl: new FormControl('2') } as HierarchyElement;

      component.onHierarchyLevelSelect(hierarchy);

      expect(store.dispatch).toHaveBeenCalledWith(new GetInstitutionHierarchyChildrenById('2'));
    });

    it('should not slice hierarchyArray or call setFinalHierarchyLevel when needToSlice is false', () => {
      const setFinalHierarchyLevelSpy = jest.spyOn(component as any, 'setFinalHierarchyLevel');
      const hierarchy = { hierarchyLevel: 2, formControl: new FormControl('2') } as HierarchyElement;

      component.onHierarchyLevelSelect(hierarchy);

      expect(component.hierarchyArray.length).toBe(2);
      expect(setFinalHierarchyLevelSpy).not.toHaveBeenCalled();
    });
  });
});

@Component({
  selector: 'app-validation-hint',
  template: ''
})
class MockValidationHintHierarchyComponent {
  @Input() validationFormControl: FormControl;
  @Input() isTouched: boolean;
}
