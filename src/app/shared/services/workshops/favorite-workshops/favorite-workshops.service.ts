import { Favorite } from './../../../models/favorite.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SearchResponse } from '../../../models/search.model';
import { WorkshopCard } from '../../../../shared/models/workshop.model';
import { Store } from '@ngxs/store';
import { PaginatorState } from '../../../store/paginator.state';
import { PaginationElement } from '../../../models/paginationElement.model';

@Injectable({
  providedIn: 'root',
})
export class FavoriteWorkshopsService {
  constructor(private http: HttpClient, private store: Store) {}

  /**
   * This method get favorite workshops
   */
  getFavoriteWorkshops(): Observable<Favorite[]> {
    return this.http.get<Favorite[]>('/api/v1/Favorite');
  }

  /**
   * This method get favorite workshops by Userid
   */
  getFavoriteWorkshopsByUserId(): Observable<SearchResponse<WorkshopCard[]>> {
    let params = new HttpParams();

    const currentPage = this.store.selectSnapshot(PaginatorState.currentPage) as PaginationElement;
    const size = this.store.selectSnapshot(PaginatorState.workshopsPerPage);
    const from = size * (+currentPage.element - 1);

    params = params.set('Size', size.toString()).set('From', from.toString());

    return this.http.get<SearchResponse<WorkshopCard[]>>('/api/v1/Favorite/workshops', { params });
  }

  /**
   * This method create favorite workshop
   * @param favorite: Favorite
   */
  createFavoriteWorkshop(favorite: Favorite): Observable<Favorite> {
    return this.http.post<Favorite>('/api/v1/Favorite', favorite);
  }

  /**
   * This method delete favorite workshop
   * @param id: string
   */
  deleteFavoriteWorkshop(id: string): Observable<void> {
    return this.http.delete<void>(`/api/v1/Favorite/${id}`);
  }
}
