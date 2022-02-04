import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { Child } from 'src/app/shared/models/child.model';
import { Parent } from 'src/app/shared/models/parent.model';
import { SocialGroup } from 'src/app/shared/models/socialGroup.model';
import { ChildrenService } from 'src/app/shared/services/children/children.service';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { GetSocialGroup } from 'src/app/shared/store/meta-data.actions';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';
import { AddNavPath } from 'src/app/shared/store/navigation.actions';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { CreateChildren, UpdateChild } from 'src/app/shared/store/user.actions';
import { TEXT_REGEX, TEXT_WITH_DIGITS_REGEX } from 'src/app/shared/constants/regex-constants';
import { Constants } from 'src/app/shared/constants/constants';
import { CreateFormComponent } from '../../create-form/create-form.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';

@Component({
  selector: 'app-create-child',
  templateUrl: './create-child.component.html',
  styleUrls: ['./create-child.component.scss']
})

export class CreateChildComponent extends CreateFormComponent implements OnInit, OnDestroy {
  child: Child;

  ChildrenFormArray = new FormArray([]);
  AgreementFormControl = new FormControl(false);
  isAgreed = false;

  @Select(MetaDataState.socialGroups)
  socialGroups$: Observable<SocialGroup[]>;

  constructor(
    private childrenService: ChildrenService,
    private fb: FormBuilder,
    store: Store,
    route: ActivatedRoute,
    navigationBarService: NavigationBarService,
    private matDialog: MatDialog) {
    super(store, route, navigationBarService);
  }

  ngOnInit(): void {
    this.determineEditMode();
    this.addNavPath();

    if (!this.editMode) {
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
    ).subscribe((val: boolean) => this.isAgreed = val);
  }

  addNavPath(): void {
    this.store.dispatch(new AddNavPath(this.navigationBarService.creatNavPaths(
      { name: NavBarName.PersonalCabinetParent, path: '/personal-cabinet/parent/info', isActive: false, disable: false },
      { name: this.editMode ? NavBarName.EditInformationAboutChild : NavBarName.AddInformationAboutChild, isActive: false, disable: true },
    )));
  }

  setEditMode(): void {
    const childId = this.route.snapshot.paramMap.get('param');

    this.childrenService.getUsersChildById(childId).pipe(
      takeUntil(this.destroy$),
    ).subscribe((child: Child) => {
      this.child = child;
      this.ChildrenFormArray.push(this.newForm(child));
    });
  }

  /**
   * This method create new FormGroup
   * @param FormArray array
   */
  private newForm(child?: Child): FormGroup {
    const childFormGroup = this.fb.group({
      lastName: new FormControl('', [
        Validators.required, 
        Validators.pattern(TEXT_REGEX), 
        Validators.minLength(1), 
        Validators.maxLength(30)
      ]),
      firstName: new FormControl('', [
        Validators.required, 
        Validators.pattern(TEXT_REGEX),
        Validators.minLength(1), 
        Validators.maxLength(30)
      ]),
      middleName: new FormControl('', [
        Validators.required, 
        Validators.pattern(TEXT_REGEX),
        Validators.minLength(1), 
        Validators.maxLength(30)
      ]),
      dateOfBirth: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      socialGroupId: new FormControl(Constants.SOCIAL_GROUP_ID_ABSENT_VALUE),
      placeOfLiving: new FormControl('', [
        Validators.pattern(TEXT_WITH_DIGITS_REGEX),
        Validators.minLength(10), 
        Validators.maxLength(256)
      ]),
      certificateOfBirth: new FormControl(''),
      placeOfStudy: new FormControl('', [
        Validators.pattern(TEXT_WITH_DIGITS_REGEX),
        Validators.minLength(10), 
        Validators.maxLength(256)
      ])
    });

    this.subscribeOnDirtyForm(childFormGroup);

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
    const status: string = this.ChildrenFormArray.controls[index].status;
    const isTouched: boolean = this.ChildrenFormArray.controls[index].touched;

    if(status !== 'INVALID' || isTouched) {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: '330px',
      data: {
        type: ModalConfirmationType.deleteChild,
        property: ''
      }
    });
   
    dialogRef.afterClosed().subscribe((result: boolean) => {
      result && this.ChildrenFormArray.removeAt(index);;
    });
    } else {
      this.ChildrenFormArray.removeAt(index);
    }   
  }
  
  /**
   * This method create or edit Child and distpatch CreateChild action
   */
  onSubmit(): void {
    if (this.ChildrenFormArray.invalid) {
      this.checkValidationChild();
    } else {
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
  }

  /**
   * This method marks each control of form in the array of forms in ChildrenFormArray as touched
   */
  private checkValidationChild(): void {
    Object.keys(this.ChildrenFormArray.controls).forEach(key => {
      this.checkValidation(<FormGroup>this.ChildrenFormArray.get(key));
    });
  }

  /**
   * This method receives a form and marks each control of this form as touched
   * @param FormGroup form
   */
  private checkValidation(form: FormGroup): void {
    Object.keys(form.controls).forEach(key => {
      form.get(key).markAsTouched();
    });
  }
}
