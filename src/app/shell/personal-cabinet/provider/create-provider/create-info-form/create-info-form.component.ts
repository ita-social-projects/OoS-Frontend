import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, filter, first, takeUntil } from 'rxjs';

import { Constants, CropperConfigurationConstants } from 'shared/constants/constants';
import { DATE_REGEX, FULL_NAME_REGEX } from 'shared/constants/regex-constants';
import { FormValidators, ValidationConstants } from 'shared/constants/validation';
import { InstitutionTypesEnum, OwnershipTypesEnum } from 'shared/enum/enumUA/provider';
import { InfoMenuType } from 'shared/enum/info-menu-type';
import { InstitutionTypes, OwnershipTypes, SelectableOwnershipTypes } from 'shared/enum/provider';
import { Institution } from 'shared/models/institution.model';
import { DataItem } from 'shared/models/item.model';
import { Provider } from 'shared/models/provider.model';
import { ActivateEditMode } from 'shared/store/app.actions';
import { AppState } from 'shared/store/app.state';
import { GetAllInstitutions, GetInstitutionStatuses, GetProviderTypes } from 'shared/store/meta-data.actions';
import { MetaDataState } from 'shared/store/meta-data.state';
import { Util } from 'shared/utils/utils';

@Component({
  selector: 'app-create-info-form',
  templateUrl: './create-info-form.component.html',
  styleUrls: ['./create-info-form.component.scss']
})
export class CreateInfoFormComponent implements OnInit, OnDestroy {
  @Input() public provider: Provider;
  @Input() public isImagesFeature: boolean;

  @Output() public passInfoFormGroup = new EventEmitter();

  @Select(AppState.isEditMode)
  public isEditMode$: Observable<boolean>;
  @Select(MetaDataState.institutions)
  public institutions$: Observable<Institution[]>;
  @Select(MetaDataState.providerTypes)
  public providerTypes$: Observable<DataItem[]>;
  @Select(MetaDataState.institutionStatuses)
  public institutionStatuses$: Observable<DataItem[]>;

  public readonly validationConstants = ValidationConstants;
  public readonly mailFormPlaceholder = Constants.MAIL_FORMAT_PLACEHOLDER;
  public readonly ownershipTypes = OwnershipTypes;
  public readonly selectableOwnerShipTypes = SelectableOwnershipTypes; // TODO: temporary removed for 1st release
  public readonly ownershipTypesEnum = OwnershipTypesEnum;
  public readonly institutionTypes = InstitutionTypes;
  public readonly institutionTypesEnum = InstitutionTypesEnum;
  public readonly InfoMenuType = InfoMenuType;

  public readonly cropperConfig = {
    cropperMinWidth: CropperConfigurationConstants.cropperMinWidth,
    cropperMaxWidth: CropperConfigurationConstants.cropperMaxWidth,
    cropperMinHeight: CropperConfigurationConstants.cropperMinHeight,
    cropperMaxHeight: CropperConfigurationConstants.cropperMaxHeight,
    cropperAspectRatio: CropperConfigurationConstants.coverImageCropperAspectRatio,
    croppedHeight: CropperConfigurationConstants.croppedCoverImage.height,
    croppedFormat: CropperConfigurationConstants.croppedFormat,
    croppedQuality: CropperConfigurationConstants.croppedQuality
  };

  public infoFormGroup: FormGroup;
  public dateFilter: RegExp = DATE_REGEX;
  // TODO: Check the maximum allowable date in this case
  public maxDate: Date = Util.getTodayBirthDate();
  public minDate: Date = Util.getMinBirthDate(ValidationConstants.BIRTH_AGE_MAX);

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private formBuilder: FormBuilder,
    private store: Store
  ) {}

  public get ownershipTypeControl(): AbstractControl {
    return this.infoFormGroup.get('ownership');
  }

  public get edrpouIpnTypeControl(): AbstractControl {
    return this.infoFormGroup.get('edrpouIpn');
  }

  public get edrpouIpnLabel(): string {
    return this.isOwnershipTypeState ? 'FORMS.LABELS.EDRPO' : 'FORMS.LABELS.IPN';
  }

  public get edrpouIpnLength(): number {
    return this.isOwnershipTypeState ? ValidationConstants.EDRPOU_LENGTH : ValidationConstants.IPN_LENGTH;
  }

  private get isOwnershipTypeState(): boolean {
    return this.infoFormGroup?.get('ownership').value === OwnershipTypes.State;
  }

  public ngOnInit(): void {
    this.initInfoFormGroup();
    this.store.dispatch([new GetAllInstitutions(true), new GetProviderTypes(), new GetInstitutionStatuses()]);
    this.initData();
    this.passInfoFormGroup.emit(this.infoFormGroup);
    this.ownershipTypeControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.isOwnershipTypeState && this.edrpouIpnTypeControl.value.length > ValidationConstants.EDRPOU_LENGTH) {
        this.edrpouIpnTypeControl.setValue(this.edrpouIpnTypeControl.value.substring(0, ValidationConstants.EDRPOU_LENGTH), {
          emitEvent: false
        });
      }
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public compareInstitutions(institution1: Institution, institution2: Institution): boolean {
    return institution1.id === institution2.id;
  }

  private initInfoFormGroup(): void {
    this.infoFormGroup = this.formBuilder.group({
      fullTitle: new FormControl('', [
        Validators.required,
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_60)
      ]),
      shortTitle: new FormControl('', [
        Validators.required,
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_60)
      ]),
      edrpouIpn: new FormControl('', [Validators.required, FormValidators.edrpouIpn]),
      director: new FormControl('', [
        Validators.required,
        Validators.pattern(FULL_NAME_REGEX),
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_60)
      ]),
      directorDateOfBirth: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', [Validators.required, Validators.minLength(ValidationConstants.PHONE_LENGTH)]),
      email: new FormControl('', [Validators.required, FormValidators.email]),
      typeId: new FormControl(null, Validators.required),
      ownership: new FormControl(null, Validators.required),
      institution: new FormControl('', Validators.required),
      institutionType: new FormControl('', Validators.required),
      institutionStatusId: new FormControl('', Validators.required),
      license: new FormControl('', [
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_60)
      ]),
      founder: new FormControl('', [
        Validators.required,
        Validators.pattern(FULL_NAME_REGEX),
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_60)
      ]),
      coverImage: new FormControl(''),
      coverImageId: new FormControl('')
    });
  }

  private initData(): void {
    // TODO: Find better workaround for FormControl disable
    this.isEditMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isEditMode: boolean) =>
        isEditMode ? this.ownershipTypeControl.disable({ emitEvent: false }) : this.ownershipTypeControl.enable({ emitEvent: false })
      );

    this.institutionStatuses$.pipe(filter(Boolean), first(), takeUntil(this.destroy$)).subscribe((institutionStatuses: DataItem[]) => {
      if (this.provider) {
        this.activateEditMode();
      } else {
        this.infoFormGroup.get('institutionStatusId').setValue(institutionStatuses[0].id, { emitEvent: false });
      }
    });
  }

  private activateEditMode(): void {
    this.store.dispatch(new ActivateEditMode(true));
    this.infoFormGroup.patchValue(this.provider, { emitEvent: false });
  }
}
