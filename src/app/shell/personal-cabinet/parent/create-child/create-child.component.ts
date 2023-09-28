import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants } from 'shared/constants/constants';
import { NAME_REGEX } from 'shared/constants/regex-constants';
import { ValidationConstants } from 'shared/constants/validation';
import { NavBarName, PersonalCabinetTitle } from 'shared/enum/enumUA/navigation-bar';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { Child } from 'shared/models/child.model';
import { DataItem } from 'shared/models/item.model';
import { Navigation } from 'shared/models/navigation.model';
import { Parent } from 'shared/models/parent.model';
import { SearchResponse } from 'shared/models/search.model';
import { NavigationBarService } from 'shared/services/navigation-bar/navigation-bar.service';
import { GetSocialGroup } from 'shared/store/meta-data.actions';
import { MetaDataState } from 'shared/store/meta-data.state';
import { AddNavPath } from 'shared/store/navigation.actions';
import { CreateChildren, GetUsersChildById, ResetSelectedChild, UpdateChild } from 'shared/store/parent.actions';
import { ParentState } from 'shared/store/parent.state';
import { RegistrationState } from 'shared/store/registration.state';
import { CreateFormComponent } from '../../shared-cabinet/create-form/create-form.component';

@Component({
  selector: 'app-create-child',
  templateUrl: './create-child.component.html',
  styleUrls: ['./create-child.component.scss']
})
export class CreateChildComponent extends CreateFormComponent implements OnInit, OnDestroy {
  public readonly childrenMaxAmount = ValidationConstants.CHILDREN_AMOUNT_MAX;

  @Select(MetaDataState.socialGroups)
  public socialGroups$: Observable<DataItem[]>;
  public socialGroups: DataItem[];
  @Select(ParentState.children)
  public childrenCards$: Observable<SearchResponse<Child[]>>;
  @Select(ParentState.selectedChild)
  public selectedChild$: Observable<Child>;
  public child: Child;

  public isDispatching = false;
  public ChildrenFormArray = new FormArray([]);
  public AgreementFormControl = new FormControl(false);
  public isAgreed = false;
  public workshopId: string;

  constructor(
    protected store: Store,
    protected route: ActivatedRoute,
    protected navigationBarService: NavigationBarService,
    private fb: FormBuilder,
    private matDialog: MatDialog,
    private router: Router
  ) {
    super(store, route, navigationBarService);

    this.socialGroups$
      .pipe(takeUntil(this.destroy$), filter(Boolean))
      .subscribe((socialGroups: DataItem[]) => (this.socialGroups = socialGroups));
  }

  public ngOnInit(): void {
    this.store.dispatch(new GetSocialGroup());

    this.determineEditMode();
    this.addNavPath();

    this.workshopId = this.route.snapshot.paramMap.get('workshopId');
    this.editMode ? this.AgreementFormControl.setValue(true) : this.ChildrenFormArray.push(this.newForm());
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
    this.store.dispatch(new ResetSelectedChild());
  }

  public addNavPath(): void {
    let previousNavPath: Navigation;

    if (this.workshopId) {
      previousNavPath = {
        name: NavBarName.RequestOnWorkshop,
        path: `/create-application/${this.workshopId}`,
        isActive: false,
        disable: false
      };
    } else {
      previousNavPath = {
        name: PersonalCabinetTitle.parent,
        path: '/personal-cabinet/parent/info',
        isActive: false,
        disable: false
      };
    }
    this.store.dispatch(
      new AddNavPath(
        this.navigationBarService.createNavPaths(previousNavPath, {
          name: this.editMode ? NavBarName.EditInformationAboutChild : NavBarName.AddInformationAboutChild,
          isActive: false,
          disable: true
        })
      )
    );
  }

  public setEditMode(): void {
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
   * This method create new FormGroup add new FormGroup to the FormArray
   */
  public addChild(): void {
    this.ChildrenFormArray.push(this.newForm());
  }

  /**
   * This method delete FormGroup from the FormArray by index
   * @param index
   */
  public onDeleteForm(index: number): void {
    const status: string = this.ChildrenFormArray.controls[index].status;
    const isPristine = this.ChildrenFormArray.controls[index].pristine;

    if (status === 'VALID' || !isPristine) {
      const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
        width: Constants.MODAL_SMALL,
        data: {
          type: ModalConfirmationType.deleteChild,
          property: ''
        }
      });

      dialogRef.afterClosed().subscribe((result: boolean) => result && this.ChildrenFormArray.removeAt(index));
    } else {
      this.ChildrenFormArray.removeAt(index);
    }
  }

  /**
   * This method create or edit Child and dispatch CreateChild action
   */
  public onSubmit(): void {
    if (!this.isDispatching) {
      if (this.ChildrenFormArray.invalid) {
        this.checkValidationChild();
      } else {
        this.matDialog.open(ConfirmationModalWindowComponent, {
          width: Constants.MODAL_SMALL,
          data: {
            type: ModalConfirmationType.editChild
          }
        }).afterClosed()
          .pipe(filter(Boolean))
          .subscribe(() => {
            this.isDispatching = true;

            this.updateInfoAboutChild();
          });
      }
    }
  }

  /**
   * This method navigate back
   */
  public onCancel(): void {
    this.router.navigate(this.workshopId ? ['/create-application', this.workshopId] : ['/personal-cabinet/parent/info']);
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
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_60)
      ]),
      firstName: new FormControl('', [
        Validators.required,
        Validators.pattern(NAME_REGEX),
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_60)
      ]),
      middleName: new FormControl('', [
        Validators.pattern(NAME_REGEX),
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_60)
      ]),
      dateOfBirth: new FormControl('', Validators.required),
      gender: new FormControl(null, Validators.required),
      socialGroups: new FormControl([]),
      placeOfStudy: new FormControl('', [
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_256)
      ])
    });

    this.subscribeOnDirtyForm(childFormGroup);

    if (this.editMode) {
      childFormGroup.patchValue(child, { emitEvent: false });
    }

    return childFormGroup;
  }

  /**
   * This method marks each control of form in the array of forms in ChildrenFormArray as touched
   */
  private checkValidationChild(): void {
    Object.keys(this.ChildrenFormArray.controls).forEach((key) => {
      this.checkValidation(this.ChildrenFormArray.get(key) as FormGroup);
    });
  }

  /**
   * This method receives a form and marks each control of this form as touched
   * @param FormGroup form
   */
  private checkValidation(form: FormGroup): void {
    Object.keys(form.controls).forEach((key) => {
      form.get(key).markAsTouched();
    });
  }

  private updateInfoAboutChild() {
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
