import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule, Store } from '@ngxs/store';

import { InstitutionHierarchyComponent } from './institution-hierarchy.component';
import {
  GetAllInstitutions,
  GetInstitutionHierarchyChildrenById,
  ResetInstitutionHierarchy,
  GetFieldDescriptionByInstitutionId
} from '../../store/meta-data.actions';

describe('InstitutionHierarchyComponent', () => {
  let component: InstitutionHierarchyComponent;
  let fixture: ComponentFixture<InstitutionHierarchyComponent>;
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
      declarations: [InstitutionHierarchyComponent, MockValidationHintHierarchyComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstitutionHierarchyComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    component.instituitionIdFormControl = new FormControl();
    component.provider = {
      institution: ''
    } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch GetAllInstitutions on init', () => {
    const storeSpy = spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(storeSpy).toHaveBeenCalledWith(new GetAllInstitutions(false));
  });

  it('should set institutionIdFormControl value in ngOnInit based on provider institution', () => {
    const institutionId = '1234';
    component.provider.institution = { id: institutionId } as any;

    component.ngOnInit();

    expect(component.instituitionIdFormControl.value).toBe(institutionId);
  });

  it('should dispatch GetInstitutionHierarchyChildrenById on hierarchy level select', () => {
    const storeSpy = spyOn(store, 'dispatch');
    const hierarchyElement = {
      formControl: new FormControl('456'),
      hierarchyLevel: 1
    } as any;
    component.hierarchyArray = [{ hierarchyLevel: 2 }] as any[];

    component.onHierarchyLevelSelect(hierarchyElement);

    expect(storeSpy).toHaveBeenCalledWith(new GetInstitutionHierarchyChildrenById('456'));
  });

  it('should dispatch ResetInstitutionHierarchy and unsubscribe on destroy', () => {
    const storeSpy = spyOn(store, 'dispatch');
    const unsubscribeSpy = spyOn(component['destroy$'], 'unsubscribe');

    component.ngOnDestroy();

    expect(storeSpy).toHaveBeenCalledWith(new ResetInstitutionHierarchy());
    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('should handle hierarchy level selection and reset hierarchy if levels are different', () => {
    const storeSpy = spyOn(store, 'dispatch');
    component.hierarchyArray = [
      { hierarchyLevel: 1, formControl: new FormControl('1') },
      { hierarchyLevel: 2, formControl: new FormControl('2') }
    ] as any[];
    const hierarchyElement = component.hierarchyArray[0];

    component.onHierarchyLevelSelect(hierarchyElement);

    expect(storeSpy).toHaveBeenCalledWith(new GetInstitutionHierarchyChildrenById('1'));
    expect(component.hierarchyArray.length).toBe(1); // It slices hierarchy array
  });

  it('should subscribe to value changes and dispatch GetFieldDescriptionByInstitutionId', () => {
    const storeSpy = spyOn(store, 'dispatch');
    const institutionId = '999';

    component.instituitionIdFormControl.setValue(institutionId);

    expect(storeSpy).toHaveBeenCalledWith(new GetFieldDescriptionByInstitutionId(institutionId));
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
