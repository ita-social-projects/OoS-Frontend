import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

import { StudySubject, StudySubjectParameters } from 'shared/models/study-subject.model';
import { SearchResponse } from 'shared/models/search.model';

@Injectable({
  providedIn: 'root'
})
export class StudySubjectService {
  private readonly baseUrl: string = '/api/v1/providers';
  constructor(private http: HttpClient) {}

  public createStudySubject(studySubject: StudySubject): Observable<StudySubject> {
    return this.http.post<StudySubject>(`${this.baseUrl}/${studySubject.providerId}/studysubjects/Create`, studySubject);
  }

  public getStudySubjects(subjectParameters: StudySubjectParameters): Observable<SearchResponse<StudySubject[]>> {
    const params = new HttpParams()
      .set('StartDate', subjectParameters.dateFrom || '')
      .set('EndDate', subjectParameters.dateTo || '')
      .set('SearchString', subjectParameters.searchString || '')
      .set('From', subjectParameters.from || '0')
      .set('Size', subjectParameters.size || '10');
    return this.http.get<SearchResponse<StudySubject[]>>(`${this.baseUrl}/${subjectParameters.providerId}/studysubjects/Get`, {
      params
    });
  }
  public getStudySubjectById(subjectId: string, providerId: string): Observable<StudySubject> {
    if (!providerId) {
      return throwError(() => new Error('Provider ID is not available'));
    }

    return this.http.get<StudySubject>(`${this.baseUrl}/${providerId}/studysubjects/GetById/${subjectId}`);
  }

  public deleteStudySubject(subjectParameters: StudySubjectParameters, subjectId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${subjectParameters.providerId}/studysubjects/Delete/${subjectId}`);
  }

  public updateStudySubject(studySubject: StudySubject): Observable<StudySubject> {
    return this.http.put<StudySubject>(`${this.baseUrl}/${studySubject.providerId}/studysubjects/Update`, studySubject);
  }
}
