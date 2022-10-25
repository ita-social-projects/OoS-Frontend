import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InstituitionHierarchy, Institution, InstitutionFieldDescription } from '../../models/institution.model';

@Injectable({
  providedIn: 'root',
})
export class InstitutionsService {
  constructor(private http: HttpClient) {}

  getAllInstitutions(): Observable<Institution[]> {
    return this.http.get<Institution[]>('/api/v1/Institution/GetAll');
  }

  getAllInstitutionHierarchies(): Observable<InstituitionHierarchy[]> {
    return this.http.get<InstituitionHierarchy[]> ('/api/v1/InstitutionHierarchy/GetAll');
  }

  getAllByInstitutionAndLevel(institutionsId: string, hierarchyLevel: number): Observable<InstituitionHierarchy[]> {
    let params = new HttpParams();
    params = params.set('institutionId', institutionsId);
    params = params.set('hierarchyLevel', hierarchyLevel.toString());

    return this.http.get<InstituitionHierarchy[]>('/api/v1/InstitutionHierarchy/GetAllByInstitutionAndLevel', {
      params,
    });
  }

  getFieldDescriptionByInstitutionId(institutionsId: string): Observable<InstitutionFieldDescription[]> {
    return this.http.get<InstitutionFieldDescription[]>(
      `/api/v1/InstitutionFieldDescription/GetByInstitutionId/${institutionsId}`
    );
  }

  getInstitutionHierarchyChildrenById(id: string): Observable<InstituitionHierarchy[]> {
    return this.http.get<InstituitionHierarchy[]>(`/api/v1/InstitutionHierarchy/GetChildren/${id}`);
  }

  getInstitutionHierarchyParentsId(id: string): Observable<InstituitionHierarchy[]> {
    let params = new HttpParams();
    params = params.set('includeCurrentLevel', 'true');
    return this.http.get<InstituitionHierarchy[]>(`/api/v1/InstitutionHierarchy/GetParents/${id}`, { params });
  }
}
