import { UpdatePlatformInfo } from 'src/app/shared/store/admin.actions';
import { PlatformInfoType } from 'src/app/shared/enum/platform';
import { ValidationConstants } from 'src/app/shared/constants/validation';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { takeUntil, filter, tap } from 'rxjs/operators';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { AdminState } from 'src/app/shared/store/admin.state';
import { CreateFormComponent } from 'src/app/shell/personal-cabinet/create-form/create-form.component';
import { CompanyInformation } from 'src/app/shared/models/сompanyInformation.model';
import { PortalEditTitleUkr } from 'src/app/shared/enum/enumUA/tech-admin/admin-tabs';
import { GetPlatformInfo } from 'src/app/shared/store/admin.actions';
import { Location } from '@angular/common';
import { СompanyInformationSectionItem } from 'src/app/shared/models/сompanyInformation.model';

@Component({
  selector: 'app-info-edit',
  templateUrl: './info-edit.component.html',
  styleUrls: ['./info-edit.component.scss']
})
export class InfoEditComponent extends CreateFormComponent implements OnInit, OnDestroy {
  readonly validationConstants = ValidationConstants;
  
  @Select(AdminState.AboutPortal)
  AboutPortal$: Observable<CompanyInformation>;
  @Select(AdminState.SupportInformation)
  SupportInformation$: Observable<CompanyInformation>;
  @Select(AdminState.LawsAndRegulations)
  LawsAndRegulations$: Observable<CompanyInformation>;

  PlatformInfoItemArray = new FormArray([]);
  titleFormControl = new FormControl('',[Validators.required]);
  editTitle: PortalEditTitleUkr;
  platformInfo: CompanyInformation;
  
  platformInfoType: PlatformInfoType;

  constructor(
    store: Store,
    route: ActivatedRoute,
    navigationBarService: NavigationBarService,
    private fb: FormBuilder,
    private location: Location
  ) {
      super(store, route, navigationBarService);
  }

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: Params) => this.setInitialData(params));
  }

  private setInitialData(params: Params): void {
    this.editMode = !!params.mode;
    this.platformInfoType = params.param;
    this.editTitle = PortalEditTitleUkr[this.platformInfoType];

    this.editMode ? this.setEditMode() :  this.onAddForm();
  }

  addNavPath(): void {
    // this.store.dispatch(new AddNavPath(this.navigationBarService.creatNavPaths(
    //   { name: NavBarName.AdminTools, isActive: false, disable: false },
    //   { name: NavBarName.Platform, isActive: false, disable: false },
    //   { name: NavBarName.About, isActive: false, disable: true }
    // ))); TODO: fix navigation path
  }

  setEditMode(): void {
    switch(this.platformInfoType) {
      case PlatformInfoType.AboutPortal:
        this.getAboutInfo();
        break;
      case PlatformInfoType.SupportInformation:
        this.getSupportInformation();
        break;
      case PlatformInfoType.LawsAndRegulations:
        this.getLawsAndRegulations();
        break;
    }
  }

  /**
   * This method creates new FormGroup
   */
  private newForm(platformInfoItem?: СompanyInformationSectionItem): FormGroup {
    const platformInfoEditFormGroup = this.fb.group({
      sectionName: new FormControl('', [
        Validators.minLength(ValidationConstants.INPUT_LENGTH_3),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_256),
        Validators.required
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(ValidationConstants.INPUT_LENGTH_3),
        Validators.maxLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_2000)
      ]),
    });
    
    if (platformInfoItem){
      platformInfoEditFormGroup.addControl('companyInformationId', this.fb.control(platformInfoItem.companyInformationId));
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
    if(this.PlatformInfoItemArray.valid && this.titleFormControl.valid){
      const platformInfoItemArray: СompanyInformationSectionItem[] = [];
      this.PlatformInfoItemArray.controls
        .forEach((form: FormGroup) => platformInfoItemArray.push(new СompanyInformationSectionItem(form.value)));
      
      const platformInfo = this.editMode ? 
        new CompanyInformation(this.titleFormControl.value, platformInfoItemArray, this.platformInfo.id) :
        new CompanyInformation(this.titleFormControl.value, platformInfoItemArray);

      this.store.dispatch(new UpdatePlatformInfo(platformInfo, this.platformInfoType));  
    }
  }

  private getAboutInfo(): void{
    this.AboutPortal$
      .pipe(
        takeUntil(this.destroy$),
        tap((aboutPortal: CompanyInformation)=> !aboutPortal && this.store.dispatch(new GetPlatformInfo())),
        filter((aboutPortal: CompanyInformation) => !!aboutPortal),
      )
      .subscribe((aboutPortal: CompanyInformation) => this.setPlatformInfo(aboutPortal)); 
  }

  private getSupportInformation(): void{
    this.SupportInformation$
    .pipe(
      takeUntil(this.destroy$),
      tap((supportInformation: CompanyInformation)=> !supportInformation && this.store.dispatch(new GetPlatformInfo())),
      filter((supportInformation: CompanyInformation) => !!supportInformation)
    )
    .subscribe((supportInformation: CompanyInformation) => this.setPlatformInfo(supportInformation)); 
  }

  private getLawsAndRegulations(): void{
    this.LawsAndRegulations$
    .pipe(
      takeUntil(this.destroy$),
      tap((lawsAndRegulations: CompanyInformation)=> !lawsAndRegulations && this.store.dispatch(new GetPlatformInfo())),
      filter((lawsAndRegulations: CompanyInformation) => !!lawsAndRegulations)
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
    this.platformInfo.companyInformationItems
      .forEach((item: СompanyInformationSectionItem) => this.PlatformInfoItemArray.push(this.newForm(item)));
  }
}