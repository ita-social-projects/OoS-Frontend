import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { CreateFormComponent } from '../../shared-cabinet/create-form/create-form.component';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { ConfirmationModalWindowComponent } from '../../../../shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants } from '../../../../shared/constants/constants';
import { NAME_REGEX } from '../../../../shared/constants/regex-constants';
import { ValidationConstants } from '../../../../shared/constants/validation';
import { ModalConfirmationType } from '../../../../shared/enum/modal-confirmation';
import { NavBarName, PersonalCabinetTitle } from '../../../../shared/enum/enumUA/navigation-bar';
import { Child } from '../../../../shared/models/child.model';
import { Parent } from '../../../../shared/models/parent.model';
import { NavigationBarService } from '../../../../shared/services/navigation-bar/navigation-bar.service';
import { GetSocialGroup } from '../../../../shared/store/meta-data.actions';
import { MetaDataState } from '../../../../shared/store/meta-data.state';
import { AddNavPath } from '../../../../shared/store/navigation.actions';
import {
  ResetSelectedChild,
  GetUsersChildById,
  UpdateChild,
  CreateChildren,
} from '../../../../shared/store/parent.actions';
import { ParentState } from '../../../../shared/store/parent.state.';
import { RegistrationState } from '../../../../shared/store/registration.state';
import { Navigation } from '../../../../shared/models/navigation.model';
import { SearchResponse } from '../../../../shared/models/search.model';
import { DataItem } from '../../../../shared/models/item.model';

@Component({
  selector: 'app-create-child',
  templateUrl: './create-child.component.html',
  styleUrls: ['./create-child.component.scss'],
})
export class CreateChildComponent extends CreateFormComponent implements OnInit, OnDestroy {
  readonly childrenMaxAmount = ValidationConstants.CHILDREN_AMOUNT_MAX;

  @Select(MetaDataState.socialGroups)
  socialGroups$: Observable<DataItem[]>;
  socialGroups: DataItem[];
  @Select(ParentState.children)
  childrenCards$: Observable<SearchResponse<Child[]>>;
  @Select(ParentState.selectedChild)
  selectedChild$: Observable<Child>;
  child: Child;

  ChildrenFormArray = new FormArray([]);
  AgreementFormControl = new FormControl(false);
  isAgreed = false;

  constructor(
    protected store: Store,
    protected route: ActivatedRoute,
    protected navigationBarService: NavigationBarService,
    private fb: FormBuilder,
    private routeParams: ActivatedRoute,
    private matDialog: MatDialog,
    private location: Location
  ) {
    super(store, route, navigationBarService);

    this.socialGroups$
      .pipe(takeUntil(this.destroy$), filter(Boolean))
      .subscribe((socialGroups: DataItem[]) => (this.socialGroups = socialGroups));
  }

  ngOnInit(): void {
    this.store.dispatch(new GetSocialGroup());

    this.determineEditMode();
    this.addNavPath();

    this.editMode ? this.AgreementFormControl.setValue(true) : this.ChildrenFormArray.push(this.newForm());
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(new ResetSelectedChild());
  }

  addNavPath(): void {
    let previousNavPath: Navigation;
    const workshopId = this.routeParams.snapshot.queryParams['workshopId'];
    if (workshopId) {
      previousNavPath = {
        name: NavBarName.RequestOnWorkshop,
        path: `/create-application/${workshopId}`,
        isActive: false,
        disable: false,
      };
    } else {
      previousNavPath = {
        name: PersonalCabinetTitle.parent,
        path: '/personal-cabinet/parent/info',
        isActive: false,
        disable: false,
      };
    }
    this.store.dispatch(
      new AddNavPath(
        this.navigationBarService.createNavPaths(previousNavPath, {
          name: this.editMode ? NavBarName.EditInformationAboutChild : NavBarName.AddInformationAboutChild,
          isActive: false,
          disable: true,
        })
      )
    );
  }

  setEditMode(): void {
    this.isAgreed = true;

    const childId = this.route.snapshot.paramMap.get('param');
    this.store.dispatch(new GetUsersChildById(childId));

    this.selectedChild$
      .pipe(
        takeUntil(this.destroy$),
        filter((child: Child) => !!child)
      )
      .subscribe((child: Child) => {
        this.child = child;
        this.ChildrenFormArray.push(this.newForm(this.child));
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
        Validators.pattern(NAME_REGEX),
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_60),
      ]),
      firstName: new FormControl('', [
        Validators.required,
        Validators.pattern(NAME_REGEX),
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_60),
      ]),
      middleName: new FormControl('', [
        Validators.pattern(NAME_REGEX),
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_60),
      ]),
      dateOfBirth: new FormControl('', Validators.required),
      gender: new FormControl(null, Validators.required),
      socialGroups: new FormControl([]),
      placeOfStudy: new FormControl('', [
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_256),
      ]),
    });

    this.subscribeOnDirtyForm(childFormGroup);

    if (this.editMode) {
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
    const isPristine = this.ChildrenFormArray.controls[index].pristine;

    if (status === 'VALID' || !isPristine) {
      const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
        width: Constants.MODAL_SMALL,
        data: {
          type: ModalConfirmationType.deleteChild,
          property: '',
        },
      });

      dialogRef.afterClosed().subscribe((result: boolean) => result && this.ChildrenFormArray.removeAt(index));
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
        const controlsData = this.ChildrenFormArray.controls.map((form: FormGroup) => new Child(form.value, parent.id));
        this.store.dispatch(new CreateChildren(controlsData));
      }
    }
  }

  /**
   * This method navigate back
   */
  onCancel(): void {
    // TODO: Fix redirection when edit canceled onBack() and then confirm
    this.location.back();
  }

  /**
   * This method marks each control of form in the array of forms in ChildrenFormArray as touched
   */
  private checkValidationChild(): void {
    Object.keys(this.ChildrenFormArray.controls).forEach(key => {
      this.checkValidation(this.ChildrenFormArray.get(key) as FormGroup);
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
