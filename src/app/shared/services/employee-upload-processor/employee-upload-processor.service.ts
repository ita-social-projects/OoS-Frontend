import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeUploadProcessorService<DataSource> {
  public readonly baseApiURL = '/api/v1';
  constructor(private readonly http: HttpClient) {}

  public uploadEmployeesList(items: DataSource[], id: string): Observable<HttpResponse<string>> {
    const payload = { employees: items };
    return this.http.put(`${this.baseApiURL}/Provider/Upload/${id}/employees/upload`, payload, {
      observe: 'response',
      responseType: 'text'
    });
  }
}
