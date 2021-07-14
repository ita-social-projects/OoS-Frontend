import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-create-child',
  templateUrl: './create-child.component.html',
  styleUrls: ['./create-child.component.scss']
})
export class CreateChildComponent implements OnInit {

  ChildrenFormArray = new FormArray([]);
  editMode: boolean = false;
  child: Child;

  @Select(MetaDataState.socialGroups)
  socialGroups$: Observable<SocialGroup[]>;
  destroy$: Subject<boolean> = new Subject<boolean>();

  @Select(AppState.isDirtyForm)
  isDirtyForm$: Observable<Boolean>;
  isPristine = true;

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private childrenService: ChildrenService) { }

  ngOnInit(): void {
    this.socialGroups$
      .pipe(
        takeUntil(this.destroy$),
      ).subscribe((socialGroups: SocialGroup[]) => {
        if (socialGroups.length === 0) {
          this.store.dispatch(new GetSocialGroup())
        }
      });
    const childId = +this.route.snapshot.paramMap.get('id');
    if (childId) {
      this.editMode = true;
      this.childrenService.getChildById(childId).subscribe((child: Child) => {
        this.child = child;
        this.ChildrenFormArray.push(this.newForm(this.child));
      })
    } else {
      this.ChildrenFormArray.push(this.newForm());
    }
  }

  /**
  * This method create new FormGroup
  * @param FormArray array
  */
  newForm(child?: Child): FormGroup {
    const childFormGroup = this.fb.group({
      lastName: new FormControl('', Validators.required),
      firstName: new FormControl('', Validators.required),
      middleName: new FormControl(''),
      dateOfBirth: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      socialGroupId: new FormControl('', Validators.required),
    });

    childFormGroup.valueChanges
      .pipe(
        takeWhile(() => this.isPristine))
      .subscribe(() => {
        this.isPristine = false;
        this.store.dispatch(new MarkFormDirty(true))
      });

    this.editMode && childFormGroup.patchValue(child, { emitEvent: false });

    return childFormGroup;
  }

  /**
  * This method create new FormGroup add new FormGroup to the FormArray
  */
  addChild() {
    this.ChildrenFormArray.push(this.newForm());
  }

  /**
  * This method delete FormGroup from the FormArray by index
  * @param index
  */
  onDeleteForm(index: number): void {
    this.ChildrenFormArray.removeAt(index)
  }

  /**
  * This method create or edit Child and distpatch CreateChild action
  */
  onSubmit() {
    const parent = this.store.selectSnapshot<Parent>(RegistrationState.parent);
    if (this.editMode) {
      let child: Child = new Child(this.ChildrenFormArray.controls[0].value, parent.id, this.child.id);
      this.store.dispatch(new UpdateChild(child));
    } else {
      this.ChildrenFormArray.controls.forEach((form: FormGroup) => {
        let child: Child = new Child(form.value, parent.id);
        this.store.dispatch(new CreateChildren(child));
      })
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
