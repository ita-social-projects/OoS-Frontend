import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Favorite } from 'shared/models/favorite.model';
import { PaginationParameters } from 'shared/models/query-parameters.model';
import { SearchResponse } from 'shared/models/search.model';
import { WorkshopCard } from 'shared/models/workshop.model';

@Injectable({
  providedIn: 'root'
})
export class FavoriteWorkshopsService {
  constructor(private http: HttpClient) {}

  /**
   * This method get favorite workshops
   */
  getFavoriteWorkshops(): Observable<Favorite[]> {
    return this.http.get<Favorite[]>('/api/v1/Favorite');
  }

  /**
   * This method get favorite workshops by Userid
   */
  getFavoriteWorkshopsByUserId(paginationParameters: PaginationParameters): Observable<SearchResponse<WorkshopCard[]>> {
    let params = new HttpParams().set('Size', paginationParameters.size.toString()).set('From', paginationParameters.from.toString());

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
