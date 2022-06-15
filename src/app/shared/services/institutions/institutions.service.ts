import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Institution } from '../../models/institution.model';

@Injectable({
  providedIn: 'root'
})
export class InstitutionsService {

  constructor(private http: HttpClient) {}

   getAllInstitutions(): Observable<Institution[]> {
    return this.http.get<Institution[]>('/api/v1/Institution/GetAll');
  }
}
