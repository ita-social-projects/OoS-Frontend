import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TechAdmin } from 'shared/models/tech-admin.model';

@Injectable({
  providedIn: 'root'
})
export class TechAdminService {
  constructor(private http: HttpClient) {}

  /**
   * This method get TechAdmin by id
   */
  public getProfile(): Observable<TechAdmin> {
    return this.http.get<TechAdmin>('/api/v1/Admin/GetProfile');
  }
}
