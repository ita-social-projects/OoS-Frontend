import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, map, switchMap, of, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';

import { ConfirmationModalWindowComponent } from 'shared-components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants } from 'shared-constants/constants';
import { NAME_REGEX } from 'shared-constants/regex-constants';
import { FormValidators, ValidationConstants } from 'shared-constants/validation';
import { AdminRoles } from 'shared-enum/admins';
import { CodeficatorCategories } from 'shared-enum/codeficator-categories';
import { NavBarName } from 'shared-enum/enumUA/navigation-bar';
import { AdminsFormTitlesEdit, AdminsFormTitlesNew } from 'shared-enum/enumUA/tech-admin/admins';
import { ModalConfirmationType } from 'shared-enum/modal-confirmation';
import { Role } from 'shared-enum/role';
import { BaseAdmin } from 'shared-models/admin.model';
import { Codeficator } from 'shared-models/codeficator.model';
import { Institution } from 'shared-models/institution.model';
import { NavigationBarService } from 'shared-services/navigation-bar/navigation-bar.service';
import { CreateAdmin, GetAdminById, UpdateAdmin } from 'shared-store/admin.actions';
import { AdminState } from 'shared-store/admin.state';
import { GetAllInstitutions, GetCodeficatorById, GetCodeficatorSearch } from 'shared-store/meta-data.actions';
import { MetaDataState } from 'shared-store/meta-data.state';
import { AddNavPath, PushNavPath } from 'shared-store/navigation.actions';
import { StudySubjectService } from 'shared/services/study-subjects/study-subjects.service';
import { RegistrationState } from 'shared-store/registration.state';
import { Util } from 'shared-utils/utils';
import { AreaAdmin } from 'shared/models/area-admin.model';
import { RegionAdmin } from 'shared/models/region-admin.model';
import { AdminFactory } from 'shared/utils/admin.utils';
import { ShowMessageBar } from 'shared/store/app.actions';
import { CreateStudySubject } from 'shared/store/provider.actions';
import { SubjectModel } from 'shared/models/study-subject.model';
import { SnackbarText } from 'shared/enum/enumUA/message-bar';
import { CreateFormComponent } from '../../shared-cabinet/create-form/create-form.component';

const defaultValidators: ValidatorFn[] = [
  Validators.required,
  Validators.pattern(NAME_REGEX),
  Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
  Validators.maxLength(ValidationConstants.INPUT_LENGTH_60)
];

@Component({
  selector: 'app-create-study-subject',
  templateUrl: './create-study-subject.component.html',
  styleUrls: ['./create-study-subject.component.scss']
})
export class CreateStudySubjectComponent extends CreateFormComponent implements OnInit, OnDestroy {
  public readonly Constants = Constants;
  public readonly ValidationConstants = ValidationConstants;

  public languages: object[];
  public studySubjectFormGroup: FormGroup;
  public formTitle: string;
  private subjectsSubject = new BehaviorSubject<any[]>([]);
  public subjects$ = this.subjectsSubject.asObservable();

  constructor(
    protected store: Store,
    protected route: ActivatedRoute,
    protected navigationBarService: NavigationBarService,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private router: Router,
    private subjectService: StudySubjectService
  ) {
    super(store, route, navigationBarService);

    this.studySubjectFormGroup = this.formBuilder.group({
      subjectName: new FormControl('', defaultValidators),
      teachingLanguageSubjectName: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(60)]),
      teachingLanguage: new FormControl('', Validators.required)
    });

    this.subscribeOnDirtyForm(this.studySubjectFormGroup);
  }

  public ngOnInit(): void {
    this.languages = [
      { id: 1, title: 'Українська', code: 'uk' },
      { id: 2, title: 'English', code: 'en' }
    ];

    this.determineEditMode();
    this.formTitle = 'Dodaty';
    this.addNavPath();
  }

  public determineEditMode(): void {}

  public setEditMode(): void {}

  public addNavPath(): void {
    this.store.dispatch(
      new PushNavPath({
        name: NavBarName.CreateSubjects,
        isActive: false,
        disable: true
      })
    );
  }

  public onSubmit(): void {
    const newSubject: SubjectModel = {
      subjName: this.studySubjectFormGroup.get('subjectName')?.value,
      teachingLangSubjName: this.studySubjectFormGroup.get('teachingLanguageSubjectName')?.value,
      teachingLang: this.studySubjectFormGroup.get('teachingLanguage')?.value.title,
      creationDate: new Date(),
      lastReferred: new Date(),
      usedIn: 0
    };
    this.subjectService.addSubject(newSubject);
    this.store.dispatch(new CreateStudySubject());
  }

  public onCancel(): void {
    this.router.navigate(['/personal-cabinet/provider/study-subjects']);
  }
}
