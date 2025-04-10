import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Workshop } from 'shared/models/workshop.model';
import { AgeComposition, EducationalShift, GroupType, PayRateType, SpecialNeedsType } from 'shared/enum/workshop';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from 'shared/modules/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsModule } from '@ngxs/store';
import { CreateAdditionalAboutFormComponent } from './create-additional-about-form.component';

describe('CreateAdditionalAboutFormComponent', () => {
  let component: CreateAdditionalAboutFormComponent;
  let fixture: ComponentFixture<CreateAdditionalAboutFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateAdditionalAboutFormComponent],
      imports: [ReactiveFormsModule, MaterialModule, BrowserAnimationsModule, TranslateModule.forRoot(), NgxsModule.forRoot([])],
      providers: [FormBuilder]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAdditionalAboutFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('price radio', () => {
    beforeEach(async () => {
      component.workshop = {} as any;
    });

    it('should should set price if has price', () => {
      component.workshop.price = 100;
      component.priceRadioBtn.setValue(true);

      expect(component.priceControl.value).toBe(100);
      expect(component.payRateControl.value).toBe(null);
    });

    it('should should reset price if is free', () => {
      component.priceRadioBtn.setValue(false);

      expect(component.priceControl.value).toBe(null);
      expect(component.payRateControl.value).toBe(PayRateType.None);
    });
  });

  it('should initialize form with default values', () => {
    expect(component.AdditionalAboutGroup.get('isSelfFinanced').value).toBeFalsy();
    expect(component.AdditionalAboutGroup.get('isInclusive').value).toBeFalsy();
    expect(component.AdditionalAboutGroup.get('specialNeedsType').value).toBe(SpecialNeedsType.None);
    expect(component.AdditionalAboutGroup.get('educationalShift').value).toBe(EducationalShift.First);
    expect(component.AdditionalAboutGroup.get('ageComposition').value).toBe(AgeComposition.SameAge);
    expect(component.AdditionalAboutGroup.get('groupType').value).toBe(GroupType.None);
  });

  it('should update form in edit mode', () => {
    const mockWorkshop = {
      isSelfFinanced: true,
      isInclusive: true,
      specialNeedsType: SpecialNeedsType.Hearing,
      educationalShift: EducationalShift.Second,
      ageComposition: AgeComposition.SameAge,
      groupType: GroupType.None
    } as unknown as Workshop;

    component.workshop = mockWorkshop;
    component.activateEditMode();

    expect(component.AdditionalAboutGroup.get('isSelfFinanced').value).toBe(mockWorkshop.isSelfFinanced);
    expect(component.AdditionalAboutGroup.get('isInclusive').value).toBe(mockWorkshop.isInclusive);
    expect(component.AdditionalAboutGroup.get('specialNeedsType').value).toBe(mockWorkshop.specialNeedsType);
    expect(component.AdditionalAboutGroup.get('educationalShift').value).toBe(mockWorkshop.educationalShift);
    expect(component.AdditionalAboutGroup.get('ageComposition').value).toBe(mockWorkshop.ageComposition);
    expect(component.AdditionalAboutGroup.get('groupType').value).toBe(mockWorkshop.groupType);
  });

  describe('price listener', () => {
    it('should mark as touched if value entered', () => {
      jest.spyOn(component.payRateControl, 'markAsTouched');
      component.priceControl.setValue(100);

      expect(component.payRateControl.markAsTouched).toHaveBeenCalled();
    });

    it('should mark as untouched if value is erased', () => {
      jest.spyOn(component.payRateControl, 'markAsUntouched');
      component.priceControl.setValue(null);

      expect(component.payRateControl.markAsUntouched).toHaveBeenCalled();
    });
  });
});
