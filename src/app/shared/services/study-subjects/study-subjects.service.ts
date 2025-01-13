import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { BehaviorSubject, Observable } from 'rxjs';

import { Constants, PaginationConstants } from 'shared/constants/constants';
import { Ordering } from 'shared/enum/ordering';
import { SubjectModel } from 'shared/models/study-subject.model';
import { Codeficator } from 'shared/models/codeficator.model';
import { FilterStateModel } from 'shared/models/filter-state.model';
import { SearchResponse } from 'shared/models/search.model';
import { FilterState } from 'shared/store/filter.state';

@Injectable({
  providedIn: 'root'
})
export class StudySubjectService {
  private subjects: any[] = [
    {
      subjName: 'Біологія',
      teachingLangSubjName: 'Biology',
      teachingLang: 'English',
      creationDate: new Date('2023-09-07'),
      lastReferred: new Date('2024-02-05'),
      usedIn: 0
    },
    {
      subjName: 'Хімія',
      teachingLangSubjName: 'Хімія',
      teachingLang: 'Українська',
      creationDate: new Date('2023-09-05'),
      lastReferred: new Date('2024-01-20'),
      usedIn: 0
    }
  ];
  private subjectsSubject = new BehaviorSubject<any[]>(this.subjects);

  constructor(
    private http: HttpClient,
    private store: Store
  ) {}

  getSubjects(): Observable<any[]> {
    return this.subjectsSubject.asObservable();
  }

  addSubject(newSubject: SubjectModel): void {
    this.subjects.push(newSubject);
    this.subjectsSubject.next(this.subjects);
  }

  deleteSubject(subject: SubjectModel): void {
    this.subjects = this.subjects.filter((s) => s.subjName !== subject.subjName);

    this.subjectsSubject.next(this.subjects);
  }
}
