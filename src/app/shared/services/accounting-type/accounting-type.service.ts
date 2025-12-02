import { Injectable } from '@angular/core';
import { CompetitiveEventAccountingType } from 'shared/models/competitive-event-accounting-type.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AccountingTypeService {
  constructor(private readonly http: HttpClient) {}

  public getCompetitiveEventAccountingTypes(): Observable<CompetitiveEventAccountingType[]> {
    return this.http.get<CompetitiveEventAccountingType[]>('/api/v1/CompetitiveEventAccountingType/GetAll', {
      // TODO: Provide actual language, since UA is the only available at the moment
      params: { localization: 'Ua' }
    });
  }
}
