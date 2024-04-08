import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminImportExportService {
  private readonly baseApiUrl = '/api/v1/admin';
  constructor(private http: HttpClient) {}

  public getAllProviders(): Observable<any> {
    const httpOptions: Object = {
      headers: new HttpHeaders({
        Accept: 'text/html',
        'Content-Type': 'text/plain; charset=utf-8'
      }),
      responseType: 'text'
    };
    return this.http.get<string>('/api/v1/admin/providers/export', httpOptions);
  }

  // public sendEmailsForVerification(emails: any[]): Observable<any[]> {
  //   return this.http.post<any[]>(`${this.baseApiUrl}/address`, emails);
  // }

  // public sendEDRPOUForVerification(edrpou: any[]): Observable<any[]> {
  //   return this.http.post<any[]>(`${this.baseApiUrl}/address`, edrpou);
  // }

  // public sendProviders(providers: any[]): Observable<any[]> {
  //   return this.http.post<any[]>(`${this.baseApiUrl}/providers`, providers);
  // }
}
