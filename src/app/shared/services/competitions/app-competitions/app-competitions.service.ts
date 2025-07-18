import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { Constants, PaginationConstants } from 'shared/constants/constants';
import { Codeficator } from 'shared/models/codeficator.model';
import { FilterState } from 'shared/store/filter.state';
import { CompetitionCard } from 'shared/models/competition.model';

@Injectable({
  providedIn: 'root'
})
export class AppCompetitionsService {
  constructor(
    private http: HttpClient,
    private store: Store
  ) {}

  /**
   * This method gets top competitions
   */
  public getTopCompetitions(): Observable<CompetitionCard[]> {
    let params = new HttpParams();

    const size = PaginationConstants.WORKSHOPS_PER_PAGE;
    const settlement = this.store.selectSnapshot(FilterState.settlement);

    params = params.set('Limit', size);
    params = this.setCityFilterParams(settlement, params);

    return this.http.get<CompetitionCard[]>('/api/v1/popular/competitions', {
      params
    });
  }

  private setCityFilterParams(settlement: Codeficator, params: HttpParams): HttpParams {
    params = params
      .set('Latitude', settlement.latitude.toString())
      .set('Longitude', settlement.longitude.toString())
      .set('CATOTTGId', settlement?.id ?? Constants.KYIV.id.toString());

    return params;
  }
}
