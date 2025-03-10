import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { LanguageListItem } from 'shared/models/language-list.model';

@Injectable({
  providedIn: 'root'
})
export class LanguageListService {
  constructor(private http: HttpClient) {}

  public getLanguageList(): Observable<LanguageListItem[]> {
    return this.http.get<LanguageListItem[]>('/api/v1/Language/Get');
  }
}
