import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, throwError } from 'rxjs';

import { SubjectModel, SubjectParameters } from 'shared/models/study-subject.model';
import { SearchResponse } from 'shared/models/search.model';

@Injectable({
  providedIn: 'root'
})
export class StudySubjectService {
  private readonly baseUrl: string = '/api/v1/providers';
  constructor(
    private http: HttpClient,
    private store: Store
  ) {}

  public createStudySubject(studySubject: SubjectModel): Observable<SubjectModel> {
    return this.http.post<SubjectModel>(`${this.baseUrl}/${studySubject.providerId}/studysubjects/Create`, studySubject);
  }

  public getStudySubjects(subjectParameters: SubjectParameters): Observable<SearchResponse<SubjectModel[]>> {
    const params = new HttpParams()
      .set('SearchString', subjectParameters.searchString || '')
      .set('From', subjectParameters.from || '0')
      .set('Size', subjectParameters.size || '10');
    return this.http.get<SearchResponse<SubjectModel[]>>(`${this.baseUrl}/${subjectParameters.providerId}/studysubjects/Get`, {
      params
    });
  }
  public getStudySubjectById(subjectId: string, providerId: string): Observable<SubjectModel> {
    if (!providerId) {
      return throwError(() => new Error('Provider ID is not available'));
    }

    return this.http.get<SubjectModel>(`${this.baseUrl}/${providerId}/studysubjects/GetById/${subjectId}`);
  }

  public deleteStudySubject(subjectParameters: SubjectParameters, subjectId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${subjectParameters.providerId}/studysubjects/Delete/${subjectId}`);
  }

  public updateStudySubject(studySubject: SubjectModel): Observable<SubjectModel> {
    return this.http.put<SubjectModel>(`${this.baseUrl}/${studySubject.providerId}/studysubjects/Update`, studySubject);
  }
}
