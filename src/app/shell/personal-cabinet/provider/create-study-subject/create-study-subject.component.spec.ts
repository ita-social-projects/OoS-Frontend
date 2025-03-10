import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ChangeDetectorRef } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { StudySubjectService } from 'shared/services/study-subjects/study-subjects.service';
import { GetLanguageList } from 'shared/store/provider.actions';
import { HttpClientModule } from '@angular/common/http';
import { CreateStudySubjectComponent } from './create-study-subject.component';

describe('CreateStudySubjectComponent', () => {
  let component: CreateStudySubjectComponent;
  let fixture: ComponentFixture<CreateStudySubjectComponent>;
  let mockStore: jest.Mocked<Store>;
  let mockRouter: jest.Mocked<Router>;
  let mockRoute: ActivatedRoute;
  let mockMatDialog: jest.Mocked<MatDialog>;

  beforeEach(async () => {
    mockStore = {
      dispatch: jest.fn(),
      select: jest.fn(),
      selectSnapshot: jest.fn()
    } as any;

    mockRouter = {
      navigate: jest.fn()
    } as any;

    mockRoute = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue('123')
        }
      }
    } as any;

    mockMatDialog = {
      open: jest.fn().mockReturnValue({
        afterClosed: jest.fn().mockReturnValue(of(true))
      })
    } as any;

    await TestBed.configureTestingModule({
      declarations: [CreateStudySubjectComponent],
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientModule, NgxsModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: MatDialog, useValue: mockMatDialog },
        StudySubjectService,
        ChangeDetectorRef
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateStudySubjectComponent);
    component = fixture.componentInstance;

    mockStore.select.mockReturnValue(of(null));
    mockStore.selectSnapshot.mockReturnValue(null);
  });

  it('should create the component', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should dispatch GetLanguageList action', () => {
      component.ngOnInit();

      expect(mockStore.dispatch).toHaveBeenCalledWith(new GetLanguageList());
    });

    it('should call addNavPath', () => {
      const addNavPathSpy = jest.spyOn(component, 'addNavPath');

      component.ngOnInit();

      expect(addNavPathSpy).toHaveBeenCalled();
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      component.studySubjectFormGroup = new FormGroup({});
      component.studySubjectFormGroup.patchValue({
        nameInUkrainian: 'Ukrainian Name',
        nameInInstructionLanguage: 'English Name',
        language: 'English'
      });
    });

    it('should not dispatch action if form is invalid or unchanged', () => {
      component.studySubjectFormGroup.markAsPristine();
      component.studySubjectFormGroup.markAsUntouched();

      component.onSubmit();

      expect(mockStore.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('onCancel', () => {
    it('should navigate to the study subjects page', () => {
      component.onCancel();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/personal-cabinet/provider/study-subjects']);
    });
  });

  describe('addNavPath', () => {
    it('should dispatch AddNavPath with correct arguments', () => {
      component.addNavPath();

      expect(mockStore.dispatch).toHaveBeenCalled();
    });
  });
});
