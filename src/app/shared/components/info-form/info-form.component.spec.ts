import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';

import { InfoFormComponent } from './info-form.component';

describe('InfoFormComponent', () => {
  let component: InfoFormComponent;
  let fixture: ComponentFixture<InfoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, NoopAnimationsModule, TranslateModule.forRoot()],
      declarations: [InfoFormComponent, MockValidationHintForInputComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoFormComponent);
    component = fixture.componentInstance;
    component.infoEditFormGroup = new FormGroup({
      sectionName: new FormControl(''),
      description: new FormControl('')
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit delete when onDelete is called', () => {
    const mockIndex = 1;
    jest.spyOn(component.deleteForm, 'emit');

    component.index = mockIndex;
    component.onDelete();

    expect(component.deleteForm.emit).toHaveBeenCalledWith(mockIndex);
  });

  it('should set value is equal to NULL in form control on focus out event if current form control is pristine', () => {
    const mockedFormControlName = 'sectionName';
    const setValueSpy = jest.spyOn(component.infoEditFormGroup.controls.sectionName, 'setValue');
    const getFormControlSpy = jest.spyOn(component.infoEditFormGroup, 'get');

    component.onFocusOut(mockedFormControlName);

    expect(getFormControlSpy).toHaveBeenCalledWith(mockedFormControlName);
    expect(setValueSpy).toHaveBeenCalledWith(null);
  });
});

@Component({
  selector: 'app-validation-hint',
  template: ''
})
class MockValidationHintForInputComponent {
  @Input() minCharacters: number;
  @Input() maxCharacters: number;
  @Input() validationFormControl: FormControl;
  @Input() maxDescriptionLength: number;
}
