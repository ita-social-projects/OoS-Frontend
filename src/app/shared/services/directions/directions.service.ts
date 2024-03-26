import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { Constants, PaginationConstants } from 'shared/constants/constants';
import { Direction, DirectionParameters } from 'shared/models/category.model';
import { Codeficator } from 'shared/models/codeficator.model';
import { SearchResponse } from 'shared/models/search.model';
import { FilterState } from 'shared/store/filter.state';

@Injectable({
  providedIn: 'root'
})
export class DirectionsService {
  constructor(
    private http: HttpClient,
    private store: Store
  ) {}

  public getFilteredDirections(directionParameters: DirectionParameters): Observable<SearchResponse<Direction[]>> {
    const options = { params: this.setParams(directionParameters) };
    return this.http.get<SearchResponse<Direction[]>>('/api/v1/Direction/GetByFilter', options);
  }

  public getDirections(): Observable<Direction[]> {
    return this.http.get<Direction[]>('/api/v1/Direction/Get');
  }

  public getTopDirections(): Observable<Direction[]> {
    let params = new HttpParams();

    const size: number = PaginationConstants.DIRECTIONS_PER_PAGE;
    const settlement: Codeficator = this.store.selectSnapshot(FilterState.settlement);

    params = params.set('catottgId', settlement?.id?.toString() ?? Constants.KYIV.id.toString()).set('limit', size.toString());

    return this.http.get<Direction[]>('/api/v1/popular/directions', { params });
  }

  public createDirection(direction: Direction): Observable<Direction> {
    return this.http.post<Direction>('/api/v1/Direction/Create', direction);
  }

  public getDirectionById(id: number): Observable<Direction> {
    return this.http.get<Direction>(`/api/v1/Direction/GetById/${id}`);
  }

  private setParams(directionParameters: DirectionParameters): HttpParams {
    let params = new HttpParams();

    if (directionParameters.searchString) {
      params = params.set('Name', directionParameters.searchString);
    }

    params = params.set('Size', directionParameters.size.toString()).set('From', directionParameters.from.toString());

    return params;
  }
}
