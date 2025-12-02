import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InstituitionHierarchy, Institution, InstitutionFieldDescription } from '../../models/institution.model';

@Injectable({
  providedIn: 'root'
})
export class InstitutionsService {
  constructor(private http: HttpClient) {}

  public getAllInstitutions(filterNonGovernment: boolean): Observable<Institution[]> {
    return this.http.get<Institution[]>('/api/v1/Institution/GetAll', { params: { filterNonGovernment } });
  }

  public getAllInstitutionHierarchies(): Observable<InstituitionHierarchy[]> {
    return this.http.get<InstituitionHierarchy[]>('/api/v1/InstitutionHierarchy/GetAll');
  }

  public getAllByInstitutionAndLevel(institutionsId: string, hierarchyLevel: number): Observable<InstituitionHierarchy[]> {
    const params = new HttpParams().set('institutionId', institutionsId).set('hierarchyLevel', hierarchyLevel.toString());

    return this.http.get<InstituitionHierarchy[]>('/api/v1/InstitutionHierarchy/GetAllByInstitutionAndLevel', {
      params
    });
  }

  public getFieldDescriptionByInstitutionId(institutionsId: string): Observable<InstitutionFieldDescription[]> {
    return this.http.get<InstitutionFieldDescription[]>(`/api/v1/InstitutionFieldDescription/GetByInstitutionId/${institutionsId}`);
  }

  public getInstitutionHierarchyChildrenById(id: string): Observable<InstituitionHierarchy[]> {
    return this.http.get<InstituitionHierarchy[]>(`/api/v1/InstitutionHierarchy/GetChildren/${id}`);
  }

  public getInstitutionHierarchyParentsId(id: string): Observable<InstituitionHierarchy[]> {
    const params = new HttpParams().set('includeCurrentLevel', 'true');

    return this.http.get<InstituitionHierarchy[]>(`/api/v1/InstitutionHierarchy/GetParents/${id}`, { params });
  }

  public editInstitutionHierarchy(insHierarchy: InstituitionHierarchy): Observable<InstituitionHierarchy> {
    return this.http.put<InstituitionHierarchy>('/api/v1/InstitutionHierarchy/Update', insHierarchy);
  }
}
