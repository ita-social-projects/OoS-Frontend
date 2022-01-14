import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { Constants } from 'src/app/shared/constants/constants';
import { TEXT_REGEX } from 'src/app/shared/constants/regex-constants';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { MarkFormDirty } from 'src/app/shared/store/app.actions';
import { AppState } from 'src/app/shared/store/app.state';
import { AddNavPath, DeleteNavPath } from 'src/app/shared/store/navigation.actions';

@Component({
  selector: 'app-support-edit',
  templateUrl: './support-edit.component.html',
  styleUrls: ['./support-edit.component.scss']
})
export class SupportEditComponent implements OnInit, OnDestroy {

  SupportFormArray = new FormArray([]);

  @Select(AppState.isDirtyForm)
  isDirtyForm$: Observable<boolean>;

  destroy$: Subject<boolean> = new Subject<boolean>();

  isPristine = true;

  constructor(
    private fb: FormBuilder, 
    private store: Store, 
    private navigationBarService: NavigationBarService) { }

  ngOnInit(): void {
    this.SupportFormArray.push(this.newForm());
    this.store.dispatch(new AddNavPath(this.navigationBarService.creatNavPaths(
      { name: NavBarName.AdminTools, isActive: false, disable: false },
      { name: NavBarName.Platform, isActive: false, disable: false },
      { name: NavBarName.Support, isActive: false, disable: true }
    )));
  }

  /**
   * This method creates new FormGroup
   */
   private newForm(): FormGroup {
    const supportEditFormGroup = this.fb.group({
      image: new FormControl(''),
      title: new FormControl('', [Validators.pattern(TEXT_REGEX)]),
      sectionName: new FormControl('', [Validators.pattern(TEXT_REGEX)]),
      description: new FormControl('', [Validators.maxLength(Constants.MAX_DESCRIPTION_ABOUT_LENGTH), Validators.required]),
    });

    supportEditFormGroup.valueChanges
      .pipe(
        takeWhile(() => this.isPristine))
      .subscribe(() => {
        this.isPristine = false;
        this.store.dispatch(new MarkFormDirty(true));
      });

      return supportEditFormGroup;
  }

  /**
   * This method creates new FormGroup adds new FormGroup to the FormArray
   */
  addAboutForm(): void {
    this.SupportFormArray.push(this.newForm());
  }

  /**
   * This method delete FormGroup from the FormArray by index
   * @param index
   */
   onDeleteForm(index: number): void {
    this.SupportFormArray.removeAt(index);
  }

  onSubmit(): void {
    if (this.SupportFormArray.invalid) {
      this.checkValidationAboutFormArray();
    } else {
    // this.SupportFormArray.controls.forEach((form: FormGroup) => {});
    }
  }

  /**
   * This method marks each control of form in the array of forms in SupportFormArray as touched
   */
   private checkValidationAboutFormArray(): void {
    Object.keys(this.SupportFormArray.controls).forEach(key => {
      this.checkValidation(<FormGroup>this.SupportFormArray.get(key));
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

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(new DeleteNavPath());
  }
}
