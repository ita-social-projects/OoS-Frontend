import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminImportExportService {
  private readonly baseApiUrl = '/api/v1';
  constructor(private http: HttpClient) {}

  public getAllProviders(): Observable<any> {
    const httpOptions: Object = {
      headers: new HttpHeaders({
        Accept: 'text/html',
        'Content-Type': 'text/plain; charset=utf-8'
      }),
      responseType: 'text'
    };
    return this.http.get<string>(`${this.baseApiUrl}/admin/providers/export`, httpOptions);
  }

  public sendEmailsEDRPOUsForVerification(emailsEdrpous: IEmailsEdrpous): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}/providers/import/validate`, emailsEdrpous);
  }

  // public sendProviders(providers: any[]): Observable<any[]> {
  //   return this.http.post<any[]>(`${this.baseApiUrl}/providers`, providers);
  // }
}

export interface IEmailsEdrpous {
  edrpous: Object;
  emails: Object;
}
