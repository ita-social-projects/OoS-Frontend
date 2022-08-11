import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Direction, DirectionsFilter } from '../../models/category.model';
import { PaginationElement } from '../../models/paginationElement.model';
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

  getTopDirections(): Observable<Direction[]> {
    return this.http.get<Direction[]>(`/api/v1/Statistic/GetDirections`);
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
