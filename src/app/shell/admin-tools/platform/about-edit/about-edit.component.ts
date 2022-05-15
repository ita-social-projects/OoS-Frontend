import { NAME_REGEX } from 'src/app/shared/constants/regex-constants';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, takeWhile } from 'rxjs/operators';
import { Constants } from 'src/app/shared/constants/constants';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { AboutPortal, AboutPortalItem } from 'src/app/shared/models/aboutPortal.model';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { UpdateInfoAboutPortal } from 'src/app/shared/store/admin.actions';
import { AdminState } from 'src/app/shared/store/admin.state';
import { MarkFormDirty } from 'src/app/shared/store/app.actions';
import { AppState } from 'src/app/shared/store/app.state';
import { AddNavPath, DeleteNavPath } from 'src/app/shared/store/navigation.actions';

@Component({
  selector: 'app-about-edit',
  templateUrl: './about-edit.component.html',
  styleUrls: ['./about-edit.component.scss']
})
export class AboutEditComponent implements OnInit, OnDestroy {

  AboutPortalItemArray = new FormArray([]);

  amountOfSections = 0;

  isActiveHeaderInfoButton = false;

  AboutFormGroup: FormGroup;

  @Select(AppState.isDirtyForm)
  isDirtyForm$: Observable<boolean>;

  @Select(AdminState.aboutPortal)
  aboutPortal$: Observable<AboutPortal>;

  destroy$: Subject<boolean> = new Subject<boolean>();

  infoAboutPortal: AboutPortal;
  isInfoAboutPortal: boolean;
  isPristine = true;

  constructor(
    private fb: FormBuilder, 
    private store: Store, 
    private navigationBarService: NavigationBarService) { }

  ngOnInit(): void {
    this.AboutFormGroup = this.fb.group({
      image: new FormControl(''),
      title: new FormControl('', [Validators.pattern(NAME_REGEX)]),
    });

    this.aboutPortal$
    .pipe(
      takeUntil(this.destroy$),
    ).subscribe((aboutPortal: AboutPortal) => {
        this.infoAboutPortal = aboutPortal;
        if (this.infoAboutPortal) {
          this.infoAboutPortal.aboutPortalItems
          .forEach((item) => this.AboutPortalItemArray.push(this.newForm(item)));
          this.AboutFormGroup.controls['title'].setValue(this.infoAboutPortal.title);
          this.amountOfSections = this.infoAboutPortal.aboutPortalItems.length;
        } else {
          this.AboutPortalItemArray.push(this.newForm());
        } 
      });
    this.store.dispatch(new AddNavPath(this.navigationBarService.creatNavPaths(
      { name: NavBarName.AdminTools, isActive: false, disable: false },
      { name: NavBarName.Platform, isActive: false, disable: false },
      { name: NavBarName.About, isActive: false, disable: true }
    )));
  }

  /**
   * This method creates new FormGroup
   */
  private newForm(aboutPortalItem?: AboutPortalItem): FormGroup {
    const aboutEditFormGroup = this.fb.group({
      sectionName: new FormControl('', [Validators.pattern(NAME_REGEX)]),
      description: new FormControl('', [Validators.required, Validators.maxLength(Constants.MAX_DESCRIPTION_ABOUT_LENGTH)]),
    });

    aboutEditFormGroup.valueChanges
      .pipe(
        takeWhile(() => this.isPristine))
      .subscribe(() => {
        this.isPristine = false;
        this.store.dispatch(new MarkFormDirty(true));
      });

      aboutPortalItem && aboutEditFormGroup.patchValue(aboutPortalItem, { emitEvent: false });

      return aboutEditFormGroup;
  }

  /**
   * This method creates new FormGroup adds new FormGroup to the FormArray
   */
   addAboutForm(): void {
    this.amountOfSections++;
    this.AboutPortalItemArray.push(this.newForm());
  }

  /**
   * This method delete FormGroup from the FormArray by index
   * @param index
   */
   onDeleteForm(index: number): void {
    this.amountOfSections--;
    this.AboutPortalItemArray.removeAt(index);
  }

  onSubmit(): void {
    if (this.AboutPortalItemArray.invalid) {
      this.checkValidationAboutFormArray(this.AboutPortalItemArray);
    } else if (this.AboutFormGroup.invalid) {
      this.checkValidation(this.AboutFormGroup);
    } else {
      let aboutPortalItemArray = [];
      this.AboutPortalItemArray.controls.forEach((form: FormGroup) => {
        aboutPortalItemArray.push(new AboutPortalItem(form.value))
      });
      const aboutPortal: AboutPortal = new AboutPortal(this.AboutFormGroup.value.title, aboutPortalItemArray);
      this.store.dispatch(new UpdateInfoAboutPortal(aboutPortal));
    }
  }
  /**
   * This method marks each control of form in the array of forms in formArray as touched
   */
   private checkValidationAboutFormArray(formArray: FormArray): void {
    Object.keys(formArray.controls).forEach(key => {
      this.checkValidation(<FormGroup>formArray.get(key));
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