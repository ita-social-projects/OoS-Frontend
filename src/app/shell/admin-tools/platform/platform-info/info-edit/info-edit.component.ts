import { UpdatePlatformInfo } from 'src/app/shared/store/admin.actions';
import { PlatformInfoType } from 'src/app/shared/enum/platform';
import { ValidationConstants } from 'src/app/shared/constants/validation';
import { NAME_REGEX } from 'src/app/shared/constants/regex-constants';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, filter, tap } from 'rxjs/operators';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { AdminState } from 'src/app/shared/store/admin.state';
import { CreateFormComponent } from 'src/app/shell/personal-cabinet/create-form/create-form.component';
import { CompanyInformation, СompanyInformationItem } from 'src/app/shared/models/сompanyInformation.model';
import { PortalEditTitleUkr } from 'src/app/shared/enum/enumUA/admin-tabs';
import { GetPlatformInfo } from 'src/app/shared/store/admin.actions';

@Component({
  selector: 'app-info-edit',
  templateUrl: './info-edit.component.html',
  styleUrls: ['./info-edit.component.scss']
})
export class InfoEditComponent extends CreateFormComponent implements OnInit, OnDestroy {
  @Select(AdminState.platformInfo)
  platformInfo$: Observable<CompanyInformation>;
  platformInfo: CompanyInformation;

  PlatformInfoItemArray = new FormArray([]);
  titleFormControl = new FormControl('',[Validators.required]);
  editTitle: PortalEditTitleUkr;
  
  private platformInfoType;

  constructor(
    store: Store,
    route: ActivatedRoute,
    navigationBarService: NavigationBarService,
    private fb: FormBuilder) {
    super(store, route, navigationBarService);
  }

  ngOnInit(): void {
    this.route.params
    .pipe(takeUntil(this.destroy$))
    .subscribe((params: Params) => this.setInitialData(params));
  }

  private setInitialData(params: Params): void {
    this.platformInfoType = params.param.replace("/edit","");
    this.editTitle = PortalEditTitleUkr[this.platformInfoType];
    this.editMode = params.param.includes('edit');
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
    this.platformInfo$
      .pipe(
        takeUntil(this.destroy$),
        tap((platformInfo: CompanyInformation)=> !platformInfo && this.store.dispatch(new GetPlatformInfo(this.platformInfoType))),
        filter((platformInfo: CompanyInformation)=> !!platformInfo))
      .subscribe((platformInfo: CompanyInformation) => {
        this.titleFormControl.setValue(platformInfo.title, { emitEvent: false });
        this.platformInfo = platformInfo;
        this.platformInfo.companyInformationItems
          .forEach((item: СompanyInformationItem) => this.PlatformInfoItemArray.push(this.newForm(item)));
      }); 
  }

  /**
   * This method creates new FormGroup
   */
  private newForm(platformInfoItem?: СompanyInformationItem): FormGroup {
    const platformInfoEditFormGroup = this.fb.group({
      sectionName: new FormControl('', [Validators.required]),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
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

  onSubmit(): void {
    if(this.PlatformInfoItemArray.valid && this.titleFormControl.valid){
      const platformInfoItemArray: СompanyInformationItem[] = [];
      this.PlatformInfoItemArray.controls
        .forEach((form: FormGroup) => platformInfoItemArray.push(new СompanyInformationItem(form.value)));
      
        const platformInfo = this.editMode ? 
          new CompanyInformation(this.titleFormControl.value, platformInfoItemArray, this.platformInfo.id) :
          new CompanyInformation(this.titleFormControl.value, platformInfoItemArray);

        this.store.dispatch(new UpdatePlatformInfo(platformInfo, this.platformInfoType));  
    }
   }
}