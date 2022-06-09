import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { Constants } from 'src/app/shared/constants/constants';
import { ValidationConstants } from 'src/app/shared/constants/validation';
import { InstitutionStatus } from 'src/app/shared/models/institutionStatus.model';
import { Provider } from 'src/app/shared/models/provider.model';
import { SectionItem } from 'src/app/shared/models/provider.model';
import { MarkFormDirty } from 'src/app/shared/store/app.actions';
import { GetInstitutionStatus } from 'src/app/shared/store/meta-data.actions';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';

@Component({
  selector: 'app-create-photo-form',
  templateUrl: './create-photo-form.component.html',
  styleUrls: ['./create-photo-form.component.scss']
})
export class CreatePhotoFormComponent implements OnInit {
  readonly validationConstants = ValidationConstants;
  @Select(MetaDataState.institutionStatuses)
  institutionStatuses$: Observable<InstitutionStatus[]>;
  destroy$: Subject<boolean> = new Subject<boolean>();

  PhotoFormGroup: FormGroup;
  descriptionFormGroup: FormControl = new FormControl('', [
    Validators.required, 
    Validators.minLength(ValidationConstants.INPUT_LENGTH_3),
    Validators.maxLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_2000)
  ]);
  SectionItems = new FormArray([]);
  isPristine = true;
  
  @Input() provider: Provider;

  @Output() passPhotoFormGroup = new EventEmitter();

  constructor(private formBuilder: FormBuilder, private store: Store ) {
    this.PhotoFormGroup = this.formBuilder.group({
      image: new FormControl(''),
      description: this.descriptionFormGroup,
      institutionStatusId: new FormControl(Constants.INSTITUTION_STATUS_ID_ABSENT_VALUE),
      sectionItems : this.SectionItems
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
  if (this.provider.providerSectionItems?.length) {
    this.provider.providerSectionItems.forEach((item: SectionItem) => this.SectionItems.push(this.newForm(item)))
  } else {
    this.onAddForm();
  }
}




   /**
   * This method creates new FormGroup
   */
    private newForm(item?: SectionItem): FormGroup {
      const EditFormGroup = this.formBuilder.group({
        name: new FormControl('', [Validators.required]),
        description: new FormControl('', [
          Validators.required,
          Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
          Validators.maxLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_2000)
        ]),
      });
      
      if (item){
        EditFormGroup.addControl('providerId', this.formBuilder.control(item.providerId));
        EditFormGroup.patchValue(item, { emitEvent: false });  
      }
  
      this.subscribeOnDirtyForm(EditFormGroup);
  
      return EditFormGroup;
    }
  
    /**
     * This method creates new FormGroup adds new FormGroup to the FormArray
     */
    onAddForm(): void {
      (this.PhotoFormGroup.get('sectionItems') as FormArray).push(this.newForm());
    }
  
    /**
     * This method delete FormGroup from the FormArray by index
     * @param index
     */
    onDeleteForm(index: number): void {
      this.SectionItems.removeAt(index);
    }

    public subscribeOnDirtyForm(form: FormGroup | FormArray): void {
      form.valueChanges
        .pipe(
          takeWhile(() => this.isPristine))
        .subscribe(() => {
          this.isPristine = false;
          this.store.dispatch(new MarkFormDirty(true));
        });
    }



  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
