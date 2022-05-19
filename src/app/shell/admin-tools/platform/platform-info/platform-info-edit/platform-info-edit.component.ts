import { ValidationConstants } from 'src/app/shared/constants/validation';
import { NAME_REGEX } from 'src/app/shared/constants/regex-constants';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { AdminState } from 'src/app/shared/store/admin.state';
import { AddNavPath } from 'src/app/shared/store/navigation.actions';
import { CreateFormComponent } from 'src/app/shell/personal-cabinet/create-form/create-form.component';
import { CompanyInformation, СompanyInformationItem } from 'src/app/shared/models/сompanyInformation.model';

@Component({
  selector: 'app-platform-info-edit',
  templateUrl: './platform-info-edit.component.html',
  styleUrls: ['./platform-info-edit.component.scss']
})
export class PlatformInfoEditComponent extends CreateFormComponent implements OnInit, OnDestroy {
  @Select(AdminState.platformInfo)
  platformInfo$: Observable<CompanyInformation>;

  PlatformInfoItemArray = new FormArray([]);
  titleFormControl = new FormControl('',[Validators.required]);

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    store: Store,
    route: ActivatedRoute,
    navigationBarService: NavigationBarService,
    private fb: FormBuilder) {
    super(store, route, navigationBarService);
  }

  addNavPath(): void {
    // this.store.dispatch(new AddNavPath(this.navigationBarService.creatNavPaths(
    //   { name: NavBarName.AdminTools, isActive: false, disable: false },
    //   { name: NavBarName.Platform, isActive: false, disable: false },
    //   { name: NavBarName.About, isActive: false, disable: true }
    // ))); TODO: fix navigation path
  }

  setEditMode(): void { }

  ngOnInit(): void {
    this.platformInfo$
      .pipe(
        takeUntil(this.destroy$),
        filter((platformInfo: CompanyInformation)=> !!platformInfo))
      .subscribe((platformInfo: CompanyInformation) => {
        platformInfo.companyInformationItems
          .forEach((item : СompanyInformationItem) => this.PlatformInfoItemArray.push(this.newForm(item)));
      });
  }

  /**
   * This method creates new FormGroup
   */
  private newForm(platformInfoItem?: СompanyInformationItem): FormGroup {
    const platformInfoEditFormGroup = this.fb.group({
      sectionName: new FormControl('', [
        Validators.required,
        Validators.pattern(NAME_REGEX)]),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_2000)
      ]),
    });

    platformInfoItem && platformInfoEditFormGroup.patchValue(platformInfoItem, { emitEvent: false });

    return platformInfoEditFormGroup;
  }

  /**
   * This method creates new FormGroup adds new FormGroup to the FormArray
   */
   onAddForm(): void {
    this.PlatformInfoItemArray.push(this.newForm());
  }

  /**
   * This method delete FormGroup from the FormArray by index
   * @param index
   */
   onDeleteForm(index: number): void {
    this.PlatformInfoItemArray.removeAt(index);
  }

  onSubmit(): void {


    // let aboutPortalItemArray = [];
    //   this.AboutPortalItemArray.controls.forEach((form: FormGroup) => {
    //     const aboutPortal = new CompanyInformationItem(form.value.title, aboutPortalItemArray);
      
    //   });


    //   this.store.dispatch(new UpdateInfoAboutPortal(aboutPortal));
    // }
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
}