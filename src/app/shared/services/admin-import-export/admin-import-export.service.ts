import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IEmailsEdrpousResponse, IEmailsEdrpous } from 'shared/models/admin-import-export.model';

@Injectable({
  providedIn: 'root'
})
export class AdminImportExportService {
  public readonly baseApiUrl = '/api/v1';
  constructor(private http: HttpClient) {}

  public getAllProviders(): Observable<string> {
    const httpOptions: Object = {
      headers: new HttpHeaders({
        Accept: 'text/html',
        'Content-Type': 'text/plain; charset=utf-8'
      }),
      responseType: 'text'
    };
    return this.http.get<string>(`${this.baseApiUrl}/admin/providers/export`, httpOptions);
  }

  public sendEmailsEDRPOUsForVerification(emailsEdrpous: IEmailsEdrpous): Observable<IEmailsEdrpousResponse> {
    return this.http.post<IEmailsEdrpousResponse>(`${this.baseApiUrl}/providers/import/validate`, emailsEdrpous);
  }
}
