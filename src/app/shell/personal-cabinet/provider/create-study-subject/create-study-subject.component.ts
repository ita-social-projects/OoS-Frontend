import { Component, OnDestroy, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, tap, combineLatest } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { ConfirmationModalWindowComponent } from 'shared-components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants } from 'shared-constants/constants';
import { MUST_CONTAIN_LETTERS } from 'shared-constants/regex-constants';
import { ValidationConstants } from 'shared-constants/validation';

import { NavBarName, PersonalCabinetTitle } from 'shared-enum/enumUA/navigation-bar';
import { ModalConfirmationType } from 'shared-enum/modal-confirmation';
import { Role } from 'shared-enum/role';
import { NavigationBarService } from 'shared-services/navigation-bar/navigation-bar.service';
import { ProviderState } from 'shared/store/provider.state';
import { Provider } from 'shared/models/provider.model';
import { AddNavPath } from 'shared-store/navigation.actions';
import { StudySubjectService } from 'shared/services/study-subjects/study-subjects.service';
import { RegistrationState } from 'shared-store/registration.state';
import { CreateStudySubject, GetLanguageList, GetStudySubjectById, UpdateStudySubject } from 'shared/store/provider.actions';
import { SubjectModel } from 'shared/models/study-subject.model';
import { LanguageListItem } from 'shared/models/language-list.model';
import { CreateFormComponent } from '../../shared-cabinet/create-form/create-form.component';

const defaultValidators: ValidatorFn[] = [
  Validators.required,
  Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
  Validators.maxLength(ValidationConstants.INPUT_LENGTH_60),
  Validators.pattern(MUST_CONTAIN_LETTERS)
];

@Component({
  selector: 'app-create-study-subject',
  templateUrl: './create-study-subject.component.html',
  styleUrls: ['./create-study-subject.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateStudySubjectComponent extends CreateFormComponent implements OnInit, OnDestroy {
  @Select(ProviderState.languageList)
  public languageList$!: Observable<LanguageListItem[]>;

  @Select(ProviderState.selectedSubject)
  public selectedSubject$: Observable<SubjectModel>;

  @Select(RegistrationState.provider)
  public provider$: Observable<Provider>;

  public readonly Constants = Constants;
  public readonly ValidationConstants = ValidationConstants;

  public studySubject: SubjectModel;
  public provider: Provider;
  public studySubjectFormGroup: FormGroup;
  public formTitle: string;
  public isDispatching = false;

  constructor(
    protected store: Store,
    protected route: ActivatedRoute,
    protected navigationBarService: NavigationBarService,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private router: Router,
    private subjectService: StudySubjectService,
    private readonly cdr: ChangeDetectorRef
  ) {
    super(store, route, navigationBarService);

    this.studySubjectFormGroup = this.formBuilder.group({
      nameInUkrainian: new FormControl('', defaultValidators),
      nameInInstructionLanguage: new FormControl('', defaultValidators),
      language: new FormControl('', Validators.required)
    });

    this.subscribeOnDirtyForm(this.studySubjectFormGroup);
  }

  public ngOnInit(): void {
    this.provider$
      .pipe(
        filter((provider: Provider) => Boolean(provider)),
        tap((provider: Provider) => {
          this.provider = provider;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.store.dispatch(new GetLanguageList());
    this.determineEditMode();
    this.addNavPath();
  }

  public setEditMode(): void {
    const subjectId = this.route.snapshot.paramMap.get('param');

    this.provider$
      .pipe(
        filter((provider: Provider) => Boolean(provider)),
        tap((provider: Provider) => {
          this.provider = provider;
          this.store.dispatch(new GetStudySubjectById(subjectId, this.provider.id));
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();

    combineLatest([
      this.selectedSubject$.pipe(filter((subject: SubjectModel) => !!subject && subject.id === subjectId)),
      this.languageList$.pipe(filter((languages: LanguageListItem[]) => !!languages && languages.length > 0))
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([subject, languages]) => {
        this.studySubject = new SubjectModel(subject, this.provider, subjectId);
        const selectedLanguage = languages.find((lang) => lang.id === subject.language.id);
        this.studySubjectFormGroup.patchValue(
          {
            nameInUkrainian: subject.nameInUkrainian,
            nameInInstructionLanguage: subject.nameInInstructionLanguage,
            language: selectedLanguage
          },
          { emitEvent: false }
        );

        this.cdr.markForCheck();
      });
  }

  public addNavPath(): void {
    const userRole = this.store.selectSnapshot<Role>(RegistrationState.role);
    const personalCabinetTitle = PersonalCabinetTitle[userRole];
    this.store.dispatch(
      new AddNavPath(
        this.navigationBarService.createNavPaths(
          {
            name: personalCabinetTitle,
            path: '/personal-cabinet/provider/administration',
            isActive: false,
            disable: false
          },
          {
            name: this.editMode ? NavBarName.EditSubject : NavBarName.CreateSubject,
            isActive: false,
            disable: true
          }
        )
      )
    );
  }

  public onSubmit(): void {
    if (this.studySubjectFormGroup.dirty && !this.isDispatching) {
      this.matDialog
        .open(ConfirmationModalWindowComponent, {
          width: Constants.MODAL_SMALL,
          data: {
            type: this.editMode ? ModalConfirmationType.editSubject : ModalConfirmationType.createSubject
          }
        })
        .afterClosed()
        .pipe(filter(Boolean))
        .subscribe(() => {
          this.isDispatching = true;

          const subjectInfo = this.studySubjectFormGroup.value;
          let subject: SubjectModel;
          if (this.editMode) {
            subject = new SubjectModel(subjectInfo, this.provider, this.studySubject.id);
            this.store.dispatch(new UpdateStudySubject(subject));
          } else {
            subject = new SubjectModel(subjectInfo, this.provider);
            this.store.dispatch(new CreateStudySubject(subject));
          }
        });
    }
  }

  public onCancel(): void {
    this.router.navigate(['/personal-cabinet/provider/study-subjects']);
  }
}
