import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminImportExportService {
  private readonly baseApiUrl = '/api/v1/admin';
  constructor(private http: HttpClient) {}

  public sendEmailsForVerification(emails: any[]): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseApiUrl}/address`, emails);
  }

  // public getAllProviders(): Observable<HttpResponse<Blob>> {
  //   return this.http.get<HttpResponse<Blob>>('/api/v1/admin/providers/export');
  // }

  public getAllProviders(): Observable<any> {
    return this.http.get<any>('/api/v1/admin/providers/export');
  }

  public sendEDRPOUForVerification(edrpou: any[]): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseApiUrl}/address`, edrpou);
  }

  public sendProviders(providers: any[]): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseApiUrl}/providers`, providers);
  }
}
