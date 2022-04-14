import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Constants } from 'src/app/shared/constants/constants';
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

  destroy$: Subject<boolean> = new Subject<boolean>();

  PhotoFormGroup: FormGroup;
  descriptionLength = 0;
  @Input() provider: Provider;


  @Output() passPhotoFormGroup = new EventEmitter();


  constructor(private formBuilder: FormBuilder, private store: Store ) {
    this.PhotoFormGroup = this.formBuilder.group({
      image: new FormControl(''),
      description: new FormControl('', Validators.required),
      institutionStatusId: new FormControl(Constants.INSTITUTION_STATUS_ID_ABSENT_VALUE),
    }); 
      this.PhotoFormGroup.get('description').valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value: string)=>this.descriptionLength = value.length);

  }

  ngOnInit(): void {
    this.store.dispatch(new GetInstitutionStatus());
    this.provider && this.activateEditMode();
    this.passPhotoFormGroup.emit(this.PhotoFormGroup);
  }

  private activateEditMode(): void {
  this.PhotoFormGroup.patchValue(this.provider, { emitEvent: false });
  this.descriptionLength = this.PhotoFormGroup.get('description').value.length;
  this.provider.institutionStatusId = this.provider.institutionStatusId || Constants.SOCIAL_GROUP_ID_ABSENT_VALUE;
}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
