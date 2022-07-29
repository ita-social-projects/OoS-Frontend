import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ApplicationList, ProviderAdminList, ProviderList} from "../../models/history-log.model";

@Injectable({
  providedIn: 'root'
})
export class HistoryLogService {

  constructor(private http: HttpClient) { }

  getProviderHistory(): Observable<ProviderList> {
    return this.http.get<ProviderList>(`/api/v1/ChangesLog/Provider`)
  };
  getProviderAdminHistory(): Observable<ProviderAdminList> {
    return this.http.get<ProviderAdminList>(`/api/v1/ChangesLog/ProviderAdmin`)
  };
  getApplicationHistory(): Observable<ApplicationList> {
    return this.http.get<ApplicationList>(`/api/v1/ChangesLog/Application`)
  }
}
