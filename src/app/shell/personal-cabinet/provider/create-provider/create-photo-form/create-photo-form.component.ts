import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Constants } from 'src/app/shared/constants/constants';
import { TEXT_WITH_DIGITS_AND_SYMBOLS_REGEX } from 'src/app/shared/constants/regex-constants';
import { InstitutionStatus } from 'src/app/shared/models/institutionStatus.model';
import { Provider } from 'src/app/shared/models/provider.model';
import { GetInstitutionStatus } from 'src/app/shared/store/meta-data.actions';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';

@Component({
  selector: 'app-create-photo-form',
  templateUrl: './create-photo-form.component.html',
  styleUrls: ['./create-photo-form.component.scss']
})
export class CreatePhotoFormComponent implements OnInit {

  readonly constants: typeof Constants = Constants;

  @Select(MetaDataState.institutionStatuses)
  institutionStatuses$: Observable<InstitutionStatus[]>;
  destroy$: Subject<boolean> = new Subject<boolean>();

  PhotoFormGroup: FormGroup;
  descriptionFormGroup: FormControl = new FormControl('', [Validators.required, Validators.pattern(TEXT_WITH_DIGITS_AND_SYMBOLS_REGEX)]);
  @Input() provider: Provider;

  @Output() passPhotoFormGroup = new EventEmitter();

  constructor(private formBuilder: FormBuilder, private store: Store ) {
    this.PhotoFormGroup = this.formBuilder.group({
      image: new FormControl(''),
      description: this.descriptionFormGroup,
      institutionStatusId: new FormControl(Constants.INSTITUTION_STATUS_ID_ABSENT_VALUE),
    }); 
  }

  ngOnInit(): void {
    this.store.dispatch(new GetInstitutionStatus());
    this.provider && this.activateEditMode();
    this.passPhotoFormGroup.emit(this.PhotoFormGroup);
  }

  private activateEditMode(): void {
  this.PhotoFormGroup.patchValue(this.provider, { emitEvent: false });
  this.provider.institutionStatusId = this.provider.institutionStatusId || Constants.SOCIAL_GROUP_ID_ABSENT_VALUE;
}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
