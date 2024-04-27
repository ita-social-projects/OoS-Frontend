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

  public sendEmailsEDRPOUsForVerification(emailsEdrpous: IEmailsEdrpous): Observable<IEmailsEdrpousResponse> {
    return this.http.post<IEmailsEdrpousResponse>(`${this.baseApiUrl}/providers/import/validate`, emailsEdrpous);
  }

  // public sendProviders(providers: any[]): Observable<any[]> {
  //   return this.http.post<any[]>(`${this.baseApiUrl}/providers`, providers);
  // }
}

export interface IEmailsEdrpous {
  edrpous: Object;
  emails: Object;
}

export interface IEmailsEdrpousResponse {
  edrpous: number[];
  emails: number[];
}

export interface IProviders {
  providerName?: string;
  ownership?: string;
  identifier?: string;
  licenseNumber?: number;
  settlement?: string;
  errors?: {
    providerNameEmpty?: boolean;
    providerNameLength?: boolean;
    ownershipEmpty?: boolean;
    identifierEmpty: boolean;
    identifierFormat: boolean;
    identifierDuplicate: boolean;
    licenseNumberEmpty: boolean;
    settlementEmpty: boolean;
    settlementLength: boolean;
    settlementLanguage: boolean;
    addressEmpty: boolean;
    addressLanguage: boolean;
    emailEmpty: boolean;
    emailFormat: boolean;
    emailDuplicate: boolean;
    phoneNumberEmpty: boolean;
    phoneNumberFormat: boolean;
  };
  address?: string;
  email?: string;
  phoneNumber?: number;
}

export interface IProvidersID extends IProviders {
  id: number;
}
