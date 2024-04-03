import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, throttleTime } from 'rxjs';
import { filter, switchMap, takeUntil, tap } from 'rxjs/operators';

import { ValidationConstants } from 'shared/constants/validation';
import { AdminTabTypes } from 'shared/enum/admins';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { AdminTabsTitles } from 'shared/enum/enumUA/tech-admin/admin-tabs';
import { CompanyInformation, CompanyInformationSectionItem } from 'shared/models/company-information.model';
import { NavigationBarService } from 'shared/services/navigation-bar/navigation-bar.service';
import { GetPlatformInfo, UpdatePlatformInfo } from 'shared/store/admin.actions';
import { AdminState } from 'shared/store/admin.state';
import { AddNavPath } from 'shared/store/navigation.actions';
import { CreateFormComponent } from '../../../../personal-cabinet/shared-cabinet/create-form/create-form.component';

@Component({
  selector: 'app-info-edit',
  templateUrl: './info-edit.component.html',
  styleUrls: ['./info-edit.component.scss']
})
export class InfoEditComponent extends CreateFormComponent implements OnInit, OnDestroy {
  @Select(AdminState.aboutPortal)
  private aboutPortal$: Observable<CompanyInformation>;
  @Select(AdminState.mainInformation)
  private mainInformation$: Observable<CompanyInformation>;
  @Select(AdminState.supportInformation)
  private supportInformation$: Observable<CompanyInformation>;
  @Select(AdminState.lawsAndRegulations)
  private lawsAndRegulations$: Observable<CompanyInformation>;

  public readonly validationConstants = ValidationConstants;

  public editTitle: AdminTabsTitles;
  public platformInfo: CompanyInformation;
  public platformInfoType: AdminTabTypes;
  public platformInfoEditFormGroup: FormGroup;
  public platformInfoItemFormArray = new FormArray([]);
  public titleFormControl = new FormControl('', [Validators.required]);
  public isMainPage = false;
  public isDispatching = false;

  private dispatchSubject = new Subject<void>();
  private defaultThrottleTime = 1000;

  constructor(
    protected store: Store,
    protected route: ActivatedRoute,
    protected navigationBarService: NavigationBarService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    super(store, route, navigationBarService);
  }

  public ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params: Params) => this.setInitialData(params));

    this.dispatchSubject
      .pipe(
        throttleTime(this.defaultThrottleTime),
        switchMap(() => this.updatePlatformInfoInStore())
      )
      .subscribe(() => (this.isDispatching = false));
  }

  public addNavPath(): void {
    this.store.dispatch(
      new AddNavPath(
        this.navigationBarService.createNavPaths(
          { name: NavBarName.Administration, isActive: false, disable: false },
          {
            name: NavBarName.Platform,
            path: '/admin-tools/platform/',
            queryParams: { page: this.platformInfoType },
            isActive: false,
            disable: false
          },
          { name: `${NavBarName[this.platformInfoType]}`, isActive: false, disable: true }
        )
      )
    );
  }

  public setEditMode(): void {
    switch (this.platformInfoType) {
      case AdminTabTypes.AboutPortal:
        this.getAboutInfo();
        break;
      case AdminTabTypes.MainPage:
        this.getMainInfo();
        break;
      case AdminTabTypes.SupportInformation:
        this.getSupportInformation();
        break;
      case AdminTabTypes.LawsAndRegulations:
        this.getLawsAndRegulations();
        break;
    }
  }

  /**
   * This method creates new FormGroup adds new FormGroup to the FormArray
   */
  public onAddForm(): void {
    this.platformInfoItemFormArray.push(this.newForm());
  }

  /**
   * This method delete FormGroup from the FormArray by index
   * @param index
   */
  public onDeleteForm(index: number): void {
    this.platformInfoItemFormArray.removeAt(index);
  }

  public onCancel(): void {
    this.router.navigate(['/admin-tools/platform']);
  }

  public onSubmit(): void {
    if (this.platformInfoItemFormArray.valid && this.titleFormControl.valid) {
      this.isDispatching = true;
      this.dispatchSubject.next();
    }
  }

  private setInitialData(params: Params): void {
    this.editMode = !!params.mode;
    this.platformInfoType = params.param;
    this.editTitle = AdminTabsTitles[this.platformInfoType];

    if (this.editMode) {
      this.setEditMode();
    } else {
      this.onAddForm();
    }

    this.addNavPath();
  }

  private updatePlatformInfoInStore(): Observable<void> {
    const platformInfoItemArray: CompanyInformationSectionItem[] = [];
    this.platformInfoItemFormArray.controls.forEach((form: FormGroup) =>
      platformInfoItemArray.push(new CompanyInformationSectionItem(form.value))
    );

    const platformInfo = this.editMode
      ? new CompanyInformation(this.titleFormControl.value, platformInfoItemArray, this.platformInfo.id)
      : new CompanyInformation(this.titleFormControl.value, platformInfoItemArray);

    return this.store.dispatch(new UpdatePlatformInfo(platformInfo, this.platformInfoType));
  }

  /**
   * This method creates new FormGroup
   */
  private newForm(platformInfoItem?: CompanyInformationSectionItem): FormGroup {
    this.platformInfoEditFormGroup = this.formBuilder.group({
      sectionName: new FormControl('', [
        Validators.minLength(ValidationConstants.INPUT_LENGTH_3),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_256),
        Validators.required
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(ValidationConstants.INPUT_LENGTH_3),
        Validators.maxLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_2000)
      ])
    });

    if (platformInfoItem) {
      this.platformInfoEditFormGroup.addControl('companyInformationId', this.formBuilder.control(platformInfoItem.companyInformationId));
      this.platformInfoEditFormGroup.patchValue(platformInfoItem, { emitEvent: false });
    }

    this.subscribeOnDirtyForm(this.platformInfoEditFormGroup);

    return this.platformInfoEditFormGroup;
  }

  private getAboutInfo(): void {
    this.aboutPortal$
      .pipe(
        takeUntil(this.destroy$),
        tap((aboutPortal: CompanyInformation) => !aboutPortal && this.store.dispatch(new GetPlatformInfo())),
        filter(Boolean)
      )
      .subscribe((aboutPortal: CompanyInformation) => this.setPlatformInfo(aboutPortal));
  }

  private getMainInfo(): void {
    this.isMainPage = true;
    this.mainInformation$
      .pipe(
        takeUntil(this.destroy$),
        tap((mainInformation: CompanyInformation) => !mainInformation && this.store.dispatch(new GetPlatformInfo())),
        filter(Boolean)
      )
      .subscribe((mainInformation: CompanyInformation) => this.setPlatformInfo(mainInformation));
  }

  private getSupportInformation(): void {
    this.supportInformation$
      .pipe(
        takeUntil(this.destroy$),
        tap((supportInformation: CompanyInformation) => !supportInformation && this.store.dispatch(new GetPlatformInfo())),
        filter(Boolean)
      )
      .subscribe((supportInformation: CompanyInformation) => this.setPlatformInfo(supportInformation));
  }

  private getLawsAndRegulations(): void {
    this.lawsAndRegulations$
      .pipe(
        takeUntil(this.destroy$),
        tap((lawsAndRegulations: CompanyInformation) => !lawsAndRegulations && this.store.dispatch(new GetPlatformInfo())),
        filter(Boolean)
      )
      .subscribe((lawsAndRegulations: CompanyInformation) => this.setPlatformInfo(lawsAndRegulations));
  }

  /**
   * This method set portalInfo data for editing
   * @param platformInfo
   */
  private setPlatformInfo(platformInfo: CompanyInformation): void {
    this.platformInfo = platformInfo;
    this.titleFormControl.setValue(this.platformInfo.title, { emitEvent: false });
    this.platformInfo.companyInformationItems.forEach((item: CompanyInformationSectionItem) =>
      this.platformInfoItemFormArray.push(this.newForm(item))
    );
  }
}
