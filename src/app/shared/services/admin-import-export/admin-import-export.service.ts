import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmailsEdrpousResponse, EmailsEdrpous } from 'shared/models/admin-import-export.model';

@Injectable({
  providedIn: 'root'
})
export class AdminImportExportService {
  public readonly baseApiUrl = '/api/v1';
  constructor(private http: HttpClient) {}

  public getAllProviders(): Observable<Blob> {
    const httpOptions: Object = {
      headers: new HttpHeaders({
        Accept: 'text/csv',
        'Content-Type': 'text/plain; charset=utf-8'
      }),
      responseType: 'text'
    };
    return this.http.get<Blob>(`${this.baseApiUrl}/admin/providers/export`, httpOptions);
  }

  public sendEmailsEDRPOUsForVerification(emailsEdrpous: EmailsEdrpous): Observable<EmailsEdrpousResponse> {
    return this.http.post<EmailsEdrpousResponse>(`${this.baseApiUrl}/providers/import/validate`, emailsEdrpous);
  }
}
