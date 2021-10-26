import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, takeWhile } from 'rxjs/operators';
import { Child } from 'src/app/shared/models/child.model';
import { Parent } from 'src/app/shared/models/parent.model';
import { SocialGroup } from 'src/app/shared/models/socialGroup.model';
import { ChildrenService } from 'src/app/shared/services/children/children.service';
import { MarkFormDirty } from 'src/app/shared/store/app.actions';
import { AppState } from 'src/app/shared/store/app.state';
import { GetSocialGroup } from 'src/app/shared/store/meta-data.actions';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { CreateChildren, UpdateChild } from 'src/app/shared/store/user.actions';
import { TEXT_REGEX } from 'src/app/shared/constants/regex-constants';
import { Constants } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-create-child',
  templateUrl: './create-child.component.html',
  styleUrls: ['./create-child.component.scss']
})
export class CreateChildComponent implements OnInit, OnDestroy {

  ChildrenFormArray = new FormArray([]);
  AgreementFormControl = new FormControl(false);
  editMode = false;
  child: Child;
  isAgreed = false;

  @Select(MetaDataState.socialGroups)
  socialGroups$: Observable<SocialGroup[]>;
  destroy$: Subject<boolean> = new Subject<boolean>();

  @Select(AppState.isDirtyForm)
  isDirtyForm$: Observable<boolean>;
  isPristine = true;

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private childrenService: ChildrenService) { }

  ngOnInit(): void {
    const childId = +this.route.snapshot.paramMap.get('id');
    if (childId) {
      this.editMode = true;
      this.childrenService.getUsersChildById(childId).pipe(
        takeUntil(this.destroy$),
      ).subscribe((child: Child) => {
        this.child = child;
        this.ChildrenFormArray.push(this.newForm(child));
      });
    } else {
      this.ChildrenFormArray.push(this.newForm());
    }

    this.socialGroups$
      .pipe(
        takeUntil(this.destroy$),
      ).subscribe((socialGroups: SocialGroup[]) => {
        if (socialGroups.length === 0) {
          this.store.dispatch(new GetSocialGroup());
        }
      });

    this.AgreementFormControl.valueChanges.pipe(
      takeUntil(this.destroy$),
    ).subscribe(val => this.isAgreed = val);
  }

  /**
   * This method create new FormGroup
   * @param FormArray array
   */
  private newForm(child?: Child): FormGroup {
    const childFormGroup = this.fb.group({
      lastName: new FormControl('', [Validators.required, Validators.pattern(TEXT_REGEX)]),
      firstName: new FormControl('', [Validators.required, Validators.pattern(TEXT_REGEX)]),
      middleName: new FormControl('', [Validators.required, Validators.pattern(TEXT_REGEX)]),
      dateOfBirth: new FormControl('', Validators.required),
      gender: new FormControl(''),
      socialGroupId: new FormControl(Constants.SOCIAL_GROUP_ID_ABSENT_VALUE),
      placeOfStudy: new FormControl('')
    });

    childFormGroup.valueChanges
      .pipe(
        takeWhile(() => this.isPristine))
      .subscribe(() => {
        this.isPristine = false;
        this.store.dispatch(new MarkFormDirty(true));
      });

    if (this.editMode) {
      child.socialGroupId = child.socialGroupId || Constants.SOCIAL_GROUP_ID_ABSENT_VALUE;
      childFormGroup.patchValue(child, { emitEvent: false });
    }
    return childFormGroup;
  }

  /**
   * This method create new FormGroup add new FormGroup to the FormArray
   */
  addChild(): void {
    this.ChildrenFormArray.push(this.newForm());
  }

  /**
   * This method delete FormGroup from the FormArray by index
   * @param index
   */
  onDeleteForm(index: number): void {
    this.ChildrenFormArray.removeAt(index);
  }

  /**
   * This method create or edit Child and distpatch CreateChild action
   */
  onSubmit(): void {
    const parent = this.store.selectSnapshot<Parent>(RegistrationState.parent);
    if (this.editMode) {
      const child: Child = new Child(this.ChildrenFormArray.controls[0].value, parent.id, this.child.id);
      this.store.dispatch(new UpdateChild(child));
    } else {
      this.ChildrenFormArray.controls.forEach((form: FormGroup) => {
        const child: Child = new Child(form.value, parent.id);
        this.store.dispatch(new CreateChildren(child));
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
