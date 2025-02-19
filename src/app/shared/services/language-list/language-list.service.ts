import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { LanguageListItem } from 'shared/models/language-list.model';

@Injectable({
  providedIn: 'root'
})
export class LanguageListService {
  constructor(
    private http: HttpClient,
    private store: Store
  ) {}

  public getLanguageList(): Observable<LanguageListItem[]> {
    return this.http.get<LanguageListItem[]>('/api/v1/Language/Get');
  }
}
