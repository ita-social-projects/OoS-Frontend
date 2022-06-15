import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InstituitionHierarchy, Institution } from '../../models/institution.model';

@Injectable({
  providedIn: 'root'
})
export class InstitutionsService {

  constructor(private http: HttpClient) {}

  getAllInstitutions(): Observable<Institution[]> {
    return this.http.get<Institution[]>('/api/v1/Institution/GetAll');
  }

  getAllByInstitutionAndLevel(institutionsId: string, hierarchyLevel: number): Observable<InstituitionHierarchy> {
    let params = new HttpParams();
    params = params.set('institutionId', institutionsId);
    params = params.set('hierarchyLevel', hierarchyLevel.toString());

    return this.http.get<InstituitionHierarchy>('/api/v1/InstitutionHierarchy/GetAllByInstitutionAndLevel');
  }
}
