import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Workshop } from 'shared/models/workshop.model';
import { AgeComposition, EducationalShift, SpecialNeedsType, WorkshopType } from 'shared/enum/workshop';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from 'shared/modules/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CreateAdditionalAboutFormComponent } from './create-additional-about-form.component';

describe('CreateAdditionalAboutFormComponent', () => {
  let component: CreateAdditionalAboutFormComponent;
  let fixture: ComponentFixture<CreateAdditionalAboutFormComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateAdditionalAboutFormComponent],
      imports: [ReactiveFormsModule, MaterialModule, BrowserAnimationsModule, TranslateModule.forRoot()],
      providers: [FormBuilder]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAdditionalAboutFormComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.AdditionalAboutGroup.get('shortStay').value).toBeFalsy();
    expect(component.AdditionalAboutGroup.get('isSelfFinanced').value).toBeFalsy();
    expect(component.AdditionalAboutGroup.get('isSpecial').value).toBeFalsy();
    expect(component.AdditionalAboutGroup.get('isInclusive').value).toBeFalsy();
    expect(component.AdditionalAboutGroup.get('specialNeedsType').value).toBe(SpecialNeedsType.None);
    expect(component.AdditionalAboutGroup.get('educationalShift').value).toBe(EducationalShift.First);
    expect(component.AdditionalAboutGroup.get('ageComposition').value).toBe(AgeComposition.SameAge);
    expect(component.AdditionalAboutGroup.get('workshopType').value).toBe(WorkshopType.None);
  });

  it('should update specialNeedsType validation when isSpecial changes', () => {
    const specialNeedsTypeControl = component.AdditionalAboutGroup.get('specialNeedsType');

    component.AdditionalAboutGroup.patchValue({ isSpecial: true });
    expect(specialNeedsTypeControl.hasValidator(Validators.required)).toBeTruthy();

    component.AdditionalAboutGroup.patchValue({ isSpecial: false });
    expect(specialNeedsTypeControl.hasValidator(Validators.required)).toBeFalsy();
    expect(specialNeedsTypeControl.value).toBe(SpecialNeedsType.None);
  });

  it('should update form in edit mode', () => {
    const mockWorkshop = {
      shortStay: true,
      isSelfFinanced: true,
      isSpecial: true,
      isInclusive: true,
      specialNeedsType: SpecialNeedsType.Hearing,
      educationalShift: EducationalShift.Second,
      ageComposition: AgeComposition.SameAge,
      workshopType: WorkshopType.None
    } as Workshop;

    component.workshop = mockWorkshop;
    component.activateEditMode();

    expect(component.AdditionalAboutGroup.get('shortStay').value).toBe(mockWorkshop.shortStay);
    expect(component.AdditionalAboutGroup.get('isSelfFinanced').value).toBe(mockWorkshop.isSelfFinanced);
    expect(component.AdditionalAboutGroup.get('isSpecial').value).toBe(mockWorkshop.isSpecial);
    expect(component.AdditionalAboutGroup.get('isInclusive').value).toBe(mockWorkshop.isInclusive);
    expect(component.AdditionalAboutGroup.get('specialNeedsType').value).toBe(mockWorkshop.specialNeedsType);
    expect(component.AdditionalAboutGroup.get('educationalShift').value).toBe(mockWorkshop.educationalShift);
    expect(component.AdditionalAboutGroup.get('ageComposition').value).toBe(mockWorkshop.ageComposition);
    expect(component.AdditionalAboutGroup.get('workshopType').value).toBe(mockWorkshop.workshopType);
  });

  it('should mark form as dirty on value changes', () => {
    component.AdditionalAboutGroup.patchValue({ shortStay: true });
    expect(component.AdditionalAboutGroup.dirty).toBeTruthy();
  });
});
