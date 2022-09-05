import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Constants } from '../../constants/constants';
import { Direction, DirectionsFilter, DirectionsStatistic } from '../../models/category.model';
import { Codeficator } from '../../models/codeficator.model';
import { PaginationElement } from '../../models/paginationElement.model';
import { FilterState } from '../../store/filter.state';
import { PaginatorState } from '../../store/paginator.state';

@Injectable({
  providedIn: 'root',
})
export class DirectionsService {
  constructor(private http: HttpClient, private store: Store) {}

  private setParams(searchString: string): HttpParams {
    let params = new HttpParams();

    if (searchString) {
      params = params.set('Name', searchString);
    }

    const currentPage = this.store.selectSnapshot(PaginatorState.currentPage) as PaginationElement;
    const size: number = this.store.selectSnapshot(PaginatorState.directionsPerPage);
    const from: number = size * (+currentPage.element - 1);

    params = params.set('Size', size.toString());
    params = params.set('From', from.toString());

    return params;
  }

  getFilteredDirections(searchString: string): Observable<DirectionsFilter> {
    const options = { params: this.setParams(searchString) };
    return this.http.get<DirectionsFilter>('/api/v1/Direction/GetByFilter', options);
  }

  getDirections(): Observable<Direction[]> {
    return this.http.get<Direction[]>('/api/v1/Direction/Get');
  }

  getTopDirections(): Observable<DirectionsStatistic[]> {
    let params = new HttpParams();

    const size: number = this.store.selectSnapshot(PaginatorState.workshopsPerPage);
    const settlement: Codeficator = this.store.selectSnapshot(FilterState.settlement);
    
    params = params.set('catottgId', settlement?.id?.toString() ?? Constants.KYIV.id.toString());
    params = params.set('limit', size.toString());

    return this.http.get<DirectionsStatistic[]>(`/api/v1/Statistic/GetDirections`, { params });
  }
  createDirection(direction: Direction): Observable<Direction> {
    return this.http.post<Direction>('/api/v1/Direction/Create', direction);
  }
  updateDirection(direction: Direction): Observable<Direction> {
    return this.http.put<Direction>('/api/v1/Direction/Update', direction);
  }

  deleteDirection(id: number): Observable<object> {
    return this.http.delete(`/api/v1/Direction/Delete/${id}`);
  }

  getDirectionById(id: number): Observable<Direction> {
    return this.http.get<Direction>(`/api/v1/Direction/GetById/${id}`);
  }
}
