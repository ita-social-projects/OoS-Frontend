import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Competition } from 'shared/models/competition.model';

@Injectable({
  providedIn: 'root'
})
export class UserCompetitionService {
  constructor(
    private http: HttpClient,
    private store: Store
  ) {}

  getCompetitionById(id: string): Observable<Competition> {
    return this.http.get<Competition>(`/api/v1/Competition/GetById/${id}`);
  }
}
