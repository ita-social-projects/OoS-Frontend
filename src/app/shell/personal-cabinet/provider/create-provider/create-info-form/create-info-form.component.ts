import { filter, first, Observable, Subject, takeUntil } from 'rxjs';

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';

import { Constants, CropperConfigurationConstants } from '../../../../../shared/constants/constants';
import { DATE_REGEX, NAME_REGEX } from '../../../../../shared/constants/regex-constants';
import { ValidationConstants } from '../../../../../shared/constants/validation';
import { InstitutionTypesEnum, OwnershipTypesEnum } from '../../../../../shared/enum/enumUA/provider';
import { InstitutionTypes, OwnershipTypes, SelectableOwnershipTypes } from '../../../../../shared/enum/provider';
import { Institution } from '../../../../../shared/models/institution.model';
import { DataItem } from '../../../../../shared/models/item.model';
import { Provider } from '../../../../../shared/models/provider.model';
import { GetAllInstitutions, GetInstitutionStatuses, GetProviderTypes } from '../../../../../shared/store/meta-data.actions';
import { MetaDataState } from '../../../../../shared/store/meta-data.state';
import { Util } from '../../../../../shared/utils/utils';

@Component({
  selector: 'app-create-info-form',
  templateUrl: './create-info-form.component.html',
  styleUrls: ['./create-info-form.component.scss']
})
export class CreateInfoFormComponent implements OnInit {
  public readonly validationConstants = ValidationConstants;
  public readonly mailFormPlaceholder = Constants.MAIL_FORMAT_PLACEHOLDER;
  public readonly phonePrefix = Constants.PHONE_PREFIX;

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

  public readonly ownershipTypes = OwnershipTypes;
  public readonly selectableOwnerShipTypes = SelectableOwnershipTypes; //TODO: temporary removed for 1st release
  public readonly ownershipTypesEnum = OwnershipTypesEnum;
  public readonly institutionTypes = InstitutionTypes;
  public readonly institutionTypesEnum = InstitutionTypesEnum;

  @Select(MetaDataState.institutions)
  public institutions$: Observable<Institution[]>;
  @Select(MetaDataState.providerTypes)
  public providerTypes$: Observable<Institution[]>;
  @Select(MetaDataState.institutionStatuses)
  public institutionStatuses$: Observable<DataItem[]>;

  @Input() public provider: Provider;
  @Input() public isRelease3: boolean;

  @Output() public passInfoFormGroup = new EventEmitter();

  private destroy$: Subject<boolean> = new Subject<boolean>();

  public InfoFormGroup: FormGroup;
  public dateFilter: RegExp = DATE_REGEX;
  public maxDate: Date = Util.getMaxBirthDate();
  public minDate: Date = Util.getMinBirthDate(ValidationConstants.BIRTH_AGE_MAX);
  public isEditMode = false;

  public get EdrpouIpnLabel(): string {
    return this.InfoFormGroup.get('ownership').value === OwnershipTypes.State ? 'FORMS.LABELS.EDRPO' : 'FORMS.LABELS.IPN';
  }

  public get ownershipTypeControl(): AbstractControl {
    return this.InfoFormGroup.get('ownership');
  }

  constructor(private formBuilder: FormBuilder, private store: Store) {
    this.InfoFormGroup = this.formBuilder.group({
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
      edrpouIpn: new FormControl('', [
        Validators.required,
        Validators.minLength(ValidationConstants.INPUT_LENGTH_8),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_10)
      ]),
      director: new FormControl('', [
        Validators.required,
        Validators.pattern(NAME_REGEX),
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_60)
      ]),
      directorDateOfBirth: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', [Validators.required, Validators.minLength(ValidationConstants.PHONE_LENGTH)]),
      email: new FormControl('', [Validators.required, Validators.email]),
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
        Validators.pattern(NAME_REGEX),
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_60)
      ])
    });
  }

  public ngOnInit(): void {
    this.store.dispatch([new GetAllInstitutions(true), new GetProviderTypes(), new GetInstitutionStatuses()]);
    this.initData();
    this.passInfoFormGroup.emit(this.InfoFormGroup);
  }

  public compareInstitutions(institution1: Institution, institution2: Institution): boolean {
    return institution1.id === institution2.id;
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  /**
   * This method fills inputs with information of edited provider
   */
  private activateEditMode(): void {
    this.isEditMode = true;
    this.InfoFormGroup.patchValue(this.provider, { emitEvent: false });
  }

  private initData(): void {
    this.institutionStatuses$.pipe(filter(Boolean), first(), takeUntil(this.destroy$)).subscribe((institutionStatuses: DataItem[]) => {
      if (this.provider) {
        this.activateEditMode();
      } else {
        this.InfoFormGroup.get('institutionStatusId').setValue(institutionStatuses[0].id, { emitEvent: false });
      }
    });
  }
}
