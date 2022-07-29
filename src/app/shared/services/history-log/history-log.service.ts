import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApplicationsHistory, ProviderAdminsHistory, ProvidersHistory} from "../../models/history-log.model";

@Injectable({
  providedIn: 'root'
})
export class HistoryLogService {

  constructor(private http: HttpClient) { }

  getProviderHistory(): Observable<ProvidersHistory> {
    return this.http.get<ProvidersHistory>(`/api/v1/ChangesLog/Provider`)
  };
  getProviderAdminHistory(): Observable<ProviderAdminsHistory> {
    return this.http.get<ProviderAdminsHistory>(`/api/v1/ChangesLog/ProviderAdmin`)
  };
  getApplicationHistory(): Observable<ApplicationsHistory> {
    return this.http.get<ApplicationsHistory>(`/api/v1/ChangesLog/Application`)
  }
}
