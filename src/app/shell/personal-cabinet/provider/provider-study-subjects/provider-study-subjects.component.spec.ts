import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule, Store } from '@ngxs/store';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { PaginatorComponent } from 'shared/components/paginator/paginator.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { GetStudySubjects } from 'shared/store/provider.actions';
import { StudySubject } from 'shared/models/study-subject.model';
import { ProviderStudySubjectsComponent } from './provider-study-subjects.component';

describe('ProviderStudySubjectsComponent', () => {
  let component: ProviderStudySubjectsComponent;
  let fixture: ComponentFixture<ProviderStudySubjectsComponent>;
  let store: Store;

  const mockSubject = (overrides?: Partial<StudySubject>): StudySubject => ({
    id: '123',
    nameInUkrainian: 'Math',
    nameInInstructionLanguage: 'Mathematics',
    isLanguageUkrainian: true,
    languageId: 2,
    language: {
      id: 2,
      code: 'UA',
      name: 'Ukrainian'
    },
    activeFrom: '2023-01-01',
    activeTo: '2023-12-31',
    workshopId: '456',
    providerId: '1',
    ...overrides
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        MatDialogModule,
        MatTableModule,
        TranslateModule.forRoot(),
        MatSelectModule,
        RouterTestingModule,
        ReactiveFormsModule,
        MatTooltipModule,
        MatIconModule,
        BrowserAnimationsModule
      ],
      declarations: [ProviderStudySubjectsComponent, PaginatorComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderStudySubjectsComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);

    // Mock provider object here
    component.provider = { id: '1' } as any; // Ensure provider has id property
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onItemsPerPageChange', () => {
    it('should update items per page and fetch study subjects', () => {
      jest.spyOn(component, 'onPageChange');
      const itemsPerPage = 20;

      component.onItemsPerPageChange(itemsPerPage);

      expect(component.subjectParameters.size).toBe(itemsPerPage);
      expect(component.onPageChange).toHaveBeenCalledWith(component.currentPage);
    });
  });

  describe('getStudySubjects', () => {
    it('should dispatch GetStudySubjects action', () => {
      (component as any).provider = { id: '1', providerId: '123' } as StudySubject;
      jest.spyOn(store, 'dispatch');

      (component as any).getStudySubjects();

      expect(store.dispatch).toHaveBeenCalledWith(new GetStudySubjects(component.subjectParameters));
    });
  });

  describe('initProviderData', () => {
    it('should initialize provider data and subscribe to study subjects', () => {
      const subject = { id: '123', providerId: '1', nameInUkrainian: 'Test Subject' } as StudySubject;
      const mockSubjects = {
        entities: [mockSubject()],
        totalAmount: 1
      };

      jest.spyOn(store, 'select').mockReturnValue(of(mockSubjects));
      jest.spyOn(component as any, 'getStudySubjects').mockImplementation(() => {});

      component.initProviderData();

      expect((component as any).getStudySubjects).toHaveBeenCalled();
      expect(component.dataSource.data).toEqual(mockSubjects.entities);
      expect(component.totalElements).toBe(mockSubjects.totalAmount);
    });
  });
});
