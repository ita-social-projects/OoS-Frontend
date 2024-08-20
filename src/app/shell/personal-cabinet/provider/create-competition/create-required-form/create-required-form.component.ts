import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CropperConfigurationConstants } from 'shared/constants/constants';
import { MUST_CONTAIN_LETTERS } from 'shared/constants/regex-constants';
import { ValidationConstants } from 'shared/constants/validation';
import { TypeOfCompetition } from 'shared/enum/Competition';
import { TypeOfCompetitionEnum } from 'shared/enum/enumUA/competition';
import { InfoMenuType } from 'shared/enum/info-menu-type';
import { OwnershipTypes } from 'shared/enum/provider';
import { Competition } from 'shared/models/competition.model';
import { Provider } from 'shared/models/provider.model';
import { Util } from 'shared/utils/utils';

@Component({
  selector: 'app-create-required-form',
  templateUrl: './create-required-form.component.html',
  styleUrls: ['./create-required-form.component.scss']
})
export class CreateRequiredFormComponent implements OnInit {
  @Input() public competition: Competition;
  @Input() public provider: Provider;
  @Input() public isImagesFeature: boolean;
  @Output() public PassRequiredFormGroup = new EventEmitter();

  public readonly validationConstants = ValidationConstants;
  public readonly TypeOfCompetitionEnum = TypeOfCompetitionEnum;
  protected maxDate: Date = Util.getMaxBirthDate(ValidationConstants.AGE_MAX);
  protected minDate: Date = Util.getMinBirthDate(ValidationConstants.BIRTH_AGE_MAX);
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
  public RequiredFormGroup: FormGroup;
  public availableSeatsRadioBtnControl: FormControl = new FormControl(true);
  private minimumSeats: number = 1;

  constructor(private formBuilder: FormBuilder) {}

  public get priceControl(): FormControl {
    return this.RequiredFormGroup.get('price') as FormControl;
  }

  public get availableSeatsControl(): FormControl {
    return this.RequiredFormGroup.get('availableSeats') as FormControl;
  }

  public get minSeats(): number {
    if (this.competition?.takenSeats === 0 || !this.competition) {
      return this.minimumSeats;
    }
    return this.competition?.takenSeats;
  }

  private initForm(): void {
    this.RequiredFormGroup = this.formBuilder.group({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_60),
        Validators.pattern(MUST_CONTAIN_LETTERS)
      ]),
      shortTitle: new FormControl('', [
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_60),
        Validators.required,
        Validators.pattern(MUST_CONTAIN_LETTERS),
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1)
      ]),
      image: new FormControl(''),
      coverImage: new FormControl(''),
      coverImageId: new FormControl(''),
      availableSeats: new FormControl({ value: null, disabled: true }, [Validators.required, Validators.min(this.minSeats)]),
      typeOfCompetition: new FormControl(TypeOfCompetition.EducationalProject, [Validators.required])
    });
  }

  public ngOnInit(): void {
    this.initForm();
    this.PassRequiredFormGroup.emit(this.RequiredFormGroup);
    console.log(this.TypeOfCompetition);
  }

  protected readonly TypeOfCompetition = TypeOfCompetition;
  protected readonly InfoMenuType = InfoMenuType;
  protected readonly ownershipType = OwnershipTypes;
  public sortTime() {
    return 0;
  }
}
