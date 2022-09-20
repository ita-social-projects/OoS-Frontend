import { ActivatedRoute, Params } from '@angular/router';
import { AdminTabs, AdminTabsUkr } from 'src/app/shared/enum/enumUA/tech-admin/admin-tabs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { filter, takeUntil, tap } from 'rxjs/operators';

import { AddNavPath } from 'src/app/shared/store/navigation.actions';
import { AdminState } from 'src/app/shared/store/admin.state';
import { AdminTabsTitle } from './../../../../../shared/enum/enumUA/tech-admin/admin-tabs';
import { CompanyInformation } from 'src/app/shared/models/сompanyInformation.model';
import { CreateFormComponent } from 'src/app/shell/personal-cabinet/shared-cabinet/create-form/create-form.component';
import { GetPlatformInfo } from 'src/app/shared/store/admin.actions';
import { Location } from '@angular/common';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { Observable } from 'rxjs';
import { UpdatePlatformInfo } from 'src/app/shared/store/admin.actions';
import { ValidationConstants } from 'src/app/shared/constants/validation';
import { СompanyInformationSectionItem } from 'src/app/shared/models/сompanyInformation.model';

@Component({
  selector: 'app-info-edit',
  templateUrl: './info-edit.component.html',
  styleUrls: ['./info-edit.component.scss'],
})
export class InfoEditComponent
  extends CreateFormComponent
  implements OnInit, OnDestroy
{
  readonly validationConstants = ValidationConstants;

  @Select(AdminState.AboutPortal)
  AboutPortal$: Observable<CompanyInformation>;
  @Select(AdminState.SupportInformation)
  SupportInformation$: Observable<CompanyInformation>;
  @Select(AdminState.LawsAndRegulations)
  LawsAndRegulations$: Observable<CompanyInformation>;

  PlatformInfoItemArray = new UntypedFormArray([]);
  titleFormControl = new UntypedFormControl('', [Validators.required]);
  editTitle: AdminTabsUkr;
  platformInfo: CompanyInformation;

  platformInfoType: AdminTabsTitle;

  constructor(
    store: Store,
    route: ActivatedRoute,
    navigationBarService: NavigationBarService,
    private fb: UntypedFormBuilder,
    private location: Location
  ) {
    super(store, route, navigationBarService);
  }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params: Params) => this.setInitialData(params));
  }

  private setInitialData(params: Params): void {
    this.editMode = !!params.mode;
    this.platformInfoType = params.param;
    this.editTitle = AdminTabsUkr[this.platformInfoType];

    this.editMode ? this.setEditMode() : this.onAddForm();
    this.addNavPath();
  }

  addNavPath(): void {
    this.store.dispatch(
      new AddNavPath(
        this.navigationBarService.createNavPaths(
          { name: NavBarName.Administration, isActive: false, disable: false },
          {
            name: NavBarName.Platform,
            path: `/admin-tools/platform/`,
            queryParams: { 'page': this.platformInfoType },
            isActive: false,
            disable: false,
          },
          { name: `Редагувати інфомацію "${NavBarName[this.platformInfoType]}"`, isActive: false, disable: true }
        )
      )
    );
  }

  setEditMode(): void {
    switch (this.platformInfoType) {
      case AdminTabsTitle.AboutPortal:
        this.getAboutInfo();
        break;
      case AdminTabsTitle.SupportInformation:
        this.getSupportInformation();
        break;
      case AdminTabsTitle.LawsAndRegulations:
        this.getLawsAndRegulations();
        break;
    }
  }

  /**
   * This method creates new FormGroup
   */
  private newForm(platformInfoItem?: СompanyInformationSectionItem): UntypedFormGroup {
    const platformInfoEditFormGroup = this.fb.group({
      sectionName: new UntypedFormControl('', [
        Validators.minLength(ValidationConstants.INPUT_LENGTH_3),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_256),
        Validators.required,
      ]),
      description: new UntypedFormControl('', [
        Validators.required,
        Validators.minLength(ValidationConstants.INPUT_LENGTH_3),
        Validators.maxLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_2000),
      ]),
    });

    if (platformInfoItem) {
      platformInfoEditFormGroup.addControl(
        'companyInformationId',
        this.fb.control(platformInfoItem.companyInformationId)
      );
      platformInfoEditFormGroup.patchValue(platformInfoItem, { emitEvent: false });
    }

    this.subscribeOnDirtyForm(platformInfoEditFormGroup);

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

  onBack(): void {
    this.location.back();
  }

  onSubmit(): void {
    if (this.PlatformInfoItemArray.valid && this.titleFormControl.valid) {
      const platformInfoItemArray: СompanyInformationSectionItem[] = [];
      this.PlatformInfoItemArray.controls.forEach((form: UntypedFormGroup) =>
        platformInfoItemArray.push(new СompanyInformationSectionItem(form.value))
      );

      const platformInfo = this.editMode
        ? new CompanyInformation(this.titleFormControl.value, platformInfoItemArray, this.platformInfo.id)
        : new CompanyInformation(this.titleFormControl.value, platformInfoItemArray);

      this.store.dispatch(new UpdatePlatformInfo(platformInfo, this.platformInfoType));
    }
  }

  private getAboutInfo(): void {
    this.AboutPortal$.pipe(
      takeUntil(this.destroy$),
      tap((aboutPortal: CompanyInformation) => !aboutPortal && this.store.dispatch(new GetPlatformInfo())),
      filter((aboutPortal: CompanyInformation) => !!aboutPortal)
    ).subscribe((aboutPortal: CompanyInformation) => this.setPlatformInfo(aboutPortal));
  }

  private getSupportInformation(): void {
    this.SupportInformation$.pipe(
      takeUntil(this.destroy$),
      tap(
        (supportInformation: CompanyInformation) => !supportInformation && this.store.dispatch(new GetPlatformInfo())
      ),
      filter((supportInformation: CompanyInformation) => !!supportInformation)
    ).subscribe((supportInformation: CompanyInformation) => this.setPlatformInfo(supportInformation));
  }

  private getLawsAndRegulations(): void {
    this.LawsAndRegulations$.pipe(
      takeUntil(this.destroy$),
      tap(
        (lawsAndRegulations: CompanyInformation) => !lawsAndRegulations && this.store.dispatch(new GetPlatformInfo())
      ),
      filter((lawsAndRegulations: CompanyInformation) => !!lawsAndRegulations)
    ).subscribe((lawsAndRegulations: CompanyInformation) => this.setPlatformInfo(lawsAndRegulations));
  }

  /**
   * This method set portalInfo data for editing
   * @param platformInfo
   */
  private setPlatformInfo(platformInfo: CompanyInformation): void {
    this.platformInfo = platformInfo;
    this.titleFormControl.setValue(this.platformInfo.title, { emitEvent: false });
    this.platformInfo.companyInformationItems.forEach((item: СompanyInformationSectionItem) =>
      this.PlatformInfoItemArray.push(this.newForm(item))
    );
  }
}
