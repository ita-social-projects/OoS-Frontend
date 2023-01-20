import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Constants } from '../../constants/constants';
import { Direction, DirectionParameters } from '../../models/category.model';
import { Codeficator } from '../../models/codeficator.model';
import { PaginationElement } from '../../models/paginationElement.model';
import { SearchResponse } from '../../models/search.model';
import { FilterState } from '../../store/filter.state';
import { PaginatorState } from '../../store/paginator.state';

@Injectable({
  providedIn: 'root'
})
export class DirectionsService {
  constructor(private http: HttpClient, private store: Store) {}

  private setParams(directionParameters: DirectionParameters): HttpParams {
    let params = new HttpParams();

    if (directionParameters.searchString) {
      params = params.set('Name', directionParameters.searchString);
    }

    params = params.set('Size', directionParameters.size.toString()).set('From', directionParameters.from.toString());

    return params;
  }

  getFilteredDirections(directionParameters: DirectionParameters): Observable<SearchResponse<Direction[]>> {
    const options = { params: this.setParams(directionParameters) };
    return this.http.get<SearchResponse<Direction[]>>('/api/v1/Direction/GetByFilter', options);
  }

  getDirections(): Observable<Direction[]> {
    return this.http.get<Direction[]>('/api/v1/Direction/Get');
  }

  getTopDirections(): Observable<Direction[]> {
    let params = new HttpParams();

    const size: number = this.store.selectSnapshot(PaginatorState.workshopsPerPage);
    const settlement: Codeficator = this.store.selectSnapshot(FilterState.settlement);

    params = params.set('catottgId', settlement?.id?.toString() ?? Constants.KYIV.id.toString()).set('limit', size.toString());

    return this.http.get<Direction[]>('/api/v1/Statistic/GetDirections', { params });
  }
  createDirection(direction: Direction): Observable<Direction> {
    return this.http.post<Direction>('/api/v1/Direction/Create', direction);
  }
  updateDirection(direction: Direction): Observable<Direction> {
    return this.http.put<Direction>('/api/v1/Direction/Update', direction);
  }

  deleteDirection(id: number): Observable<void> {
    return this.http.delete<void>(`/api/v1/Direction/Delete/${id}`);
  }

  getDirectionById(id: number): Observable<Direction> {
    return this.http.get<Direction>(`/api/v1/Direction/GetById/${id}`);
  }
}
