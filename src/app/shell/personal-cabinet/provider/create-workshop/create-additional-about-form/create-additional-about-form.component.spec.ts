import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Workshop } from 'shared/models/workshop.model';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';

import { AgeComposition, EducationalShift, GroupType, PayRateType, SpecialNeedsType } from 'shared/enum/workshop';
import { MaterialModule } from 'shared/modules/material.module';
import { GetAllInstitutions } from 'shared/store/meta-data.actions';
import { Constants } from 'shared/constants/constants';
import { CreateAdditionalAboutFormComponent } from './create-additional-about-form.component';

describe('CreateAdditionalAboutFormComponent', () => {
  let component: CreateAdditionalAboutFormComponent;
  let fixture: ComponentFixture<CreateAdditionalAboutFormComponent>;
  let store: Store;

  const mockInstitutions = [
    { id: '1', title: 'Test Institution' },
    { id: '2', title: Constants.MIN_SPORT },
    { id: '3', title: '  ' + Constants.MIN_SPORT + '  ' },
    { id: '4', title: Constants.MIN_SPORT.toUpperCase() }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateAdditionalAboutFormComponent],
      imports: [ReactiveFormsModule, MaterialModule, BrowserAnimationsModule, TranslateModule.forRoot(), NgxsModule.forRoot([])],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                has: () => false
              }
            }
          }
        }
      ]
    }).compileComponents();

    store = TestBed.inject(Store);
    jest.spyOn(store, 'dispatch').mockImplementation(() => of({}));
    jest.spyOn(store, 'select').mockImplementation(() => of(mockInstitutions));
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
    expect(component.AdditionalAboutGroup.get('workshopType').value).toBe(GroupType.Workshop);
  });

  it('should update form in edit mode', () => {
    const mockWorkshop = {
      isSelfFinanced: true,
      isInclusive: true,
      specialNeedsType: SpecialNeedsType.Hearing,
      educationalShift: EducationalShift.Second,
      ageComposition: AgeComposition.SameAge,
      workshopType: GroupType.Workshop
    } as unknown as Workshop;

    component.workshop = mockWorkshop;
    component.activateEditMode();

    expect(component.AdditionalAboutGroup.get('isSelfFinanced').value).toBe(mockWorkshop.isSelfFinanced);
    expect(component.AdditionalAboutGroup.get('isInclusive').value).toBe(mockWorkshop.isInclusive);
    expect(component.AdditionalAboutGroup.get('specialNeedsType').value).toBe(mockWorkshop.specialNeedsType);
    expect(component.AdditionalAboutGroup.get('educationalShift').value).toBe(mockWorkshop.educationalShift);
    expect(component.AdditionalAboutGroup.get('ageComposition').value).toBe(mockWorkshop.ageComposition);
    expect(component.AdditionalAboutGroup.get('workshopType').value).toBe(mockWorkshop.workshopType);
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

  describe('checkIfMinSport', () => {
    beforeEach(() => {
      component.workshop = {} as Workshop;
    });

    it('should return early if institutionId is not set', () => {
      component.AdditionalAboutGroup.get('institutionId').setValue('');

      const dispatchSpy = jest.spyOn(store, 'dispatch');
      (component as any).checkIfMinSport();

      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('should return early if institutionId is null', () => {
      component.AdditionalAboutGroup.get('institutionId').setValue(null);

      const dispatchSpy = jest.spyOn(store, 'dispatch');
      (component as any).checkIfMinSport();

      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('should dispatch GetAllInstitutions when institutionId is set', () => {
      component.AdditionalAboutGroup.get('institutionId').setValue('1');

      const dispatchSpy = jest.spyOn(store, 'dispatch');
      (component as any).checkIfMinSport();

      expect(dispatchSpy).toHaveBeenCalledWith(new GetAllInstitutions(false));
    });

    it('should call onInstitutionSubordinationChange with true when institution is MinSport', () => {
      component.AdditionalAboutGroup.get('institutionId').setValue('2');
      const onInstitutionSubordinationChangeSpy = jest.spyOn(component, 'onInstitutionSubordinationChange');

      (component as any).checkIfMinSport();

      expect(onInstitutionSubordinationChangeSpy).toHaveBeenCalledWith(true);
    });

    it('should call onInstitutionSubordinationChange with true when institution is MinSport with spaces', () => {
      component.AdditionalAboutGroup.get('institutionId').setValue('3');
      const onInstitutionSubordinationChangeSpy = jest.spyOn(component, 'onInstitutionSubordinationChange');

      (component as any).checkIfMinSport();

      expect(onInstitutionSubordinationChangeSpy).toHaveBeenCalledWith(true);
    });

    it('should call onInstitutionSubordinationChange with true when institution is MinSport in uppercase', () => {
      component.AdditionalAboutGroup.get('institutionId').setValue('4');
      const onInstitutionSubordinationChangeSpy = jest.spyOn(component, 'onInstitutionSubordinationChange');

      (component as any).checkIfMinSport();

      expect(onInstitutionSubordinationChangeSpy).toHaveBeenCalledWith(true);
    });

    it('should call onInstitutionSubordinationChange with false when institution is not MinSport', () => {
      component.AdditionalAboutGroup.get('institutionId').setValue('1');
      const onInstitutionSubordinationChangeSpy = jest.spyOn(component, 'onInstitutionSubordinationChange');

      (component as any).checkIfMinSport();

      expect(onInstitutionSubordinationChangeSpy).toHaveBeenCalledWith(false);
    });

    it('should handle case when institution is not found', () => {
      component.AdditionalAboutGroup.get('institutionId').setValue('999');
      const onInstitutionSubordinationChangeSpy = jest.spyOn(component, 'onInstitutionSubordinationChange');

      (component as any).checkIfMinSport();

      expect(onInstitutionSubordinationChangeSpy).toHaveBeenCalledWith(false);
    });
  });

  describe('handlePriceChange', () => {
    beforeEach(() => {
      component.workshop = {} as Workshop;
    });

    it('should enable price and payRate controls when workshop has price', () => {
      component.workshop.price = 150;
      component.workshop.payRate = PayRateType.Class;

      const setPriceControlValueSpy = jest.spyOn(component as any, 'setPriceControlValue');
      const setPayRateControlValueSpy = jest.spyOn(component as any, 'setPayRateControlValue');

      (component as any).handlePriceChange();

      expect(setPriceControlValueSpy).toHaveBeenCalledWith(150, 'enable', false);
      expect(setPayRateControlValueSpy).toHaveBeenCalledWith(PayRateType.Class, 'enable', false);
      expect(component.priceRadioBtn.value).toBe(true);
    });

    it('should disable price and payRate controls when workshop has no price', () => {
      component.workshop.price = null;

      const setPriceControlValueSpy = jest.spyOn(component as any, 'setPriceControlValue');
      const setPayRateControlValueSpy = jest.spyOn(component as any, 'setPayRateControlValue');

      (component as any).handlePriceChange();

      expect(setPriceControlValueSpy).toHaveBeenCalledWith(null, 'disable', false);
      expect(setPayRateControlValueSpy).toHaveBeenCalledWith(PayRateType.None, 'disable', false);
    });

    it('should disable price and payRate controls when workshop price is 0', () => {
      component.workshop.price = 0;

      const setPriceControlValueSpy = jest.spyOn(component as any, 'setPriceControlValue');
      const setPayRateControlValueSpy = jest.spyOn(component as any, 'setPayRateControlValue');

      (component as any).handlePriceChange();

      expect(setPriceControlValueSpy).toHaveBeenCalledWith(null, 'disable', false);
      expect(setPayRateControlValueSpy).toHaveBeenCalledWith(PayRateType.None, 'disable', false);
    });

    it('should disable price and payRate controls when workshop price is undefined', () => {
      component.workshop.price = undefined;

      const setPriceControlValueSpy = jest.spyOn(component as any, 'setPriceControlValue');
      const setPayRateControlValueSpy = jest.spyOn(component as any, 'setPayRateControlValue');

      (component as any).handlePriceChange();

      expect(setPriceControlValueSpy).toHaveBeenCalledWith(null, 'disable', false);
      expect(setPayRateControlValueSpy).toHaveBeenCalledWith(PayRateType.None, 'disable', false);
    });
  });

  describe('handleMinSportChange', () => {
    let workshopTypeControl: any;
    let championsPathControl: any;

    beforeEach(() => {
      workshopTypeControl = component.AdditionalAboutGroup.get('workshopType');
      championsPathControl = component.AdditionalAboutGroup.get('isChampionPath');

      jest.spyOn(workshopTypeControl, 'setValue');
      jest.spyOn(workshopTypeControl, 'disable');
      jest.spyOn(workshopTypeControl, 'enable');
      jest.spyOn(championsPathControl, 'setValue');
    });

    it('should set workshop type to Section and disable control when isMinSport is true', () => {
      (component as any).handleMinSportChange(true);

      expect(workshopTypeControl.setValue).toHaveBeenCalledWith(GroupType.Section, { emitEvent: false });
      expect(workshopTypeControl.disable).toHaveBeenCalledWith({ emitEvent: false });
    });

    it('should enable workshop type control when isMinSport is false', () => {
      (component as any).handleMinSportChange(false);

      expect(workshopTypeControl.enable).toHaveBeenCalledWith({ emitEvent: false });
      expect(championsPathControl.setValue).toHaveBeenCalledWith(false, { emitEvent: false });
    });

    it('should set workshop type to Workshop when isMinSport is false and no existing workshop', () => {
      component.workshop = null;

      (component as any).handleMinSportChange(false);

      expect(workshopTypeControl.setValue).toHaveBeenCalledWith(GroupType.Workshop, { emitEvent: false });
      expect(championsPathControl.setValue).toHaveBeenCalledWith(false, { emitEvent: false });
    });

    it('should not set workshop type value when isMinSport is false and workshop exists', () => {
      component.workshop = { workshopType: GroupType.Section } as Workshop;

      (component as any).handleMinSportChange(false);

      expect(workshopTypeControl.setValue).not.toHaveBeenCalledWith(GroupType.Workshop, { emitEvent: false });
      expect(championsPathControl.setValue).toHaveBeenCalledWith(false, { emitEvent: false });
    });

    it('should not change champions path when isMinSport is true', () => {
      (component as any).handleMinSportChange(true);

      expect(championsPathControl.setValue).not.toHaveBeenCalled();
    });
  });

  describe('onInstitutionSubordinationChange', () => {
    it('should set isMinSportSelected to true when isMinSport is true', () => {
      component.onInstitutionSubordinationChange(true);

      expect(component.isMinSportSelected).toBe(true);
    });

    it('should set isMinSportSelected to false when isMinSport is false', () => {
      component.onInstitutionSubordinationChange(false);

      expect(component.isMinSportSelected).toBe(false);
    });

    it('should set showChampionsPathCheckbox to true when isMinSport is true', () => {
      component.onInstitutionSubordinationChange(true);

      expect(component.showChampionsPathCheckbox).toBe(true);
    });

    it('should set showChampionsPathCheckbox to false when isMinSport is false', () => {
      component.onInstitutionSubordinationChange(false);

      expect(component.showChampionsPathCheckbox).toBe(false);
    });

    it('should call handleMinSportChange with true when isMinSport is true', () => {
      const handleMinSportChangeSpy = jest.spyOn(component as any, 'handleMinSportChange');

      component.onInstitutionSubordinationChange(true);

      expect(handleMinSportChangeSpy).toHaveBeenCalledWith(true);
    });

    it('should call handleMinSportChange with false when isMinSport is false', () => {
      const handleMinSportChangeSpy = jest.spyOn(component as any, 'handleMinSportChange');

      component.onInstitutionSubordinationChange(false);

      expect(handleMinSportChangeSpy).toHaveBeenCalledWith(false);
    });

    it('should update both properties and call handleMinSportChange in correct order', () => {
      const handleMinSportChangeSpy = jest.spyOn(component as any, 'handleMinSportChange');

      component.onInstitutionSubordinationChange(true);

      expect(component.isMinSportSelected).toBe(true);
      expect(component.showChampionsPathCheckbox).toBe(true);
      expect(handleMinSportChangeSpy).toHaveBeenCalledWith(true);
    });
  });

  describe('integration tests', () => {
    it('should properly handle MinSport workflow from checkIfMinSport to handleMinSportChange', () => {
      component.workshop = {} as Workshop;
      component.AdditionalAboutGroup.get('institutionId').setValue('2'); // MinSport institution

      const handleMinSportChangeSpy = jest.spyOn(component as any, 'handleMinSportChange');

      (component as any).checkIfMinSport();

      expect(component.isMinSportSelected).toBe(true);
      expect(component.showChampionsPathCheckbox).toBe(true);
      expect(handleMinSportChangeSpy).toHaveBeenCalledWith(true);
      expect(component.AdditionalAboutGroup.get('workshopType').value).toBe(GroupType.Section);
    });

    it('should properly handle non-MinSport workflow', () => {
      component.workshop = null;
      component.AdditionalAboutGroup.get('institutionId').setValue('1'); // Regular institution

      const handleMinSportChangeSpy = jest.spyOn(component as any, 'handleMinSportChange');

      (component as any).checkIfMinSport();

      expect(component.isMinSportSelected).toBe(false);
      expect(component.showChampionsPathCheckbox).toBe(false);
      expect(handleMinSportChangeSpy).toHaveBeenCalledWith(false);
      expect(component.AdditionalAboutGroup.get('workshopType').value).toBe(GroupType.Workshop);
    });
  });
});
