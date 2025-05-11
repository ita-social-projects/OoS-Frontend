import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { AddNavPath } from 'shared-store/navigation.actions';
import { ProviderState } from 'shared/store/provider.state';
import { RegistrationState } from 'shared-store/registration.state';
import { CreateStudySubject, GetLanguageList, GetStudySubjectById, UpdateStudySubject } from 'shared/store/provider.actions';
import { combineLatest, Observable, tap } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { Constants } from 'shared-constants/constants';
import { MUST_CONTAIN_LETTERS } from 'shared-constants/regex-constants';
import { ValidationConstants } from 'shared-constants/validation';
import { NavBarName, PersonalCabinetTitle } from 'shared-enum/enumUA/navigation-bar';
import { ModalConfirmationType } from 'shared-enum/modal-confirmation';
import { Role } from 'shared-enum/role';
import { Provider } from 'shared/models/provider.model';
import { StudySubject } from 'shared/models/study-subject.model';
import { LanguageListItem } from 'shared/models/language-list.model';
import { NavigationBarService } from 'shared-services/navigation-bar/navigation-bar.service';
import { StudySubjectService } from 'shared/services/study-subjects/study-subjects.service';
import { ConfirmationModalWindowComponent } from 'shared-components/confirmation-modal-window/confirmation-modal-window.component';
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
  public selectedSubject$: Observable<StudySubject>;

  @Select(RegistrationState.provider)
  public provider$: Observable<Provider>;

  public readonly ValidationConstants = ValidationConstants;

  public studySubject: StudySubject;
  public provider: Provider;
  public studySubjectFormGroup: FormGroup;
  public formTitle: string;
  public isDispatching = false;

  constructor(
    protected store: Store,
    protected route: ActivatedRoute,
    protected navigationBarService: NavigationBarService,
    private readonly formBuilder: FormBuilder,
    private readonly matDialog: MatDialog,
    private readonly router: Router,
    private readonly subjectSubjectService: StudySubjectService,
    private readonly cdr: ChangeDetectorRef
  ) {
    super(store, route, navigationBarService);
  }

  public ngOnInit(): void {
    this.studySubjectFormGroup = this.formBuilder.group({
      nameInUkrainian: new FormControl('', defaultValidators),
      nameInInstructionLanguage: new FormControl('', defaultValidators),
      language: new FormControl('', Validators.required)
    });

    this.subscribeOnDirtyForm(this.studySubjectFormGroup);
    this.provider$
      .pipe(
        filter(Boolean),
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

    if (this.provider) {
      this.store.dispatch(new GetStudySubjectById(subjectId, this.provider.id));
    }

    combineLatest([
      this.selectedSubject$.pipe(filter((subject: StudySubject) => !!subject && subject?.id === subjectId)),
      this.languageList$.pipe(filter((languages: LanguageListItem[]) => !!languages && languages?.length > 0))
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([subject, languages]) => {
        this.studySubject = new StudySubject(subject, this.provider, subjectId);
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
            path: '/personal-cabinet/provider/study-subjects',
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
          let subject: StudySubject;
          if (this.editMode) {
            subject = new StudySubject(subjectInfo, this.provider, this.studySubject.id);
            this.store.dispatch(new UpdateStudySubject(subject));
          } else {
            subject = new StudySubject(subjectInfo, this.provider);
            this.store.dispatch(new CreateStudySubject(subject));
          }
        });
    }
  }

  public onCancel(): void {
    this.router.navigate(['/personal-cabinet/provider/study-subjects']);
  }
}
