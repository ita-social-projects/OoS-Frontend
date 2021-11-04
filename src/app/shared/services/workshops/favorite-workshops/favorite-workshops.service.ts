import { Favorite, WorkshopFavoriteCard } from './../../../models/favorite.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoriteWorkshopsService {

  constructor(private http: HttpClient) { }

  /**
   * This method get favorite workshops
   */
  getFavoriteWorkshops(): Observable<Favorite[]> {
    return this.http.get<Favorite[]>('/api/v1/Favorite');
  }

  /**
   * This method get favorite workshops by Userid
   */
  getFavoriteWorkshopsByUserId(): Observable<WorkshopFavoriteCard> {
    return this.http.get<WorkshopFavoriteCard>('/api/v1/Favorite/workshops');
  }

  /**
   * This method create favorite workshop
   * @param favorite: Favorite
   */
  createFavoriteWorkshop(favorite: Favorite): Observable<object> {
    return this.http.post('/api/v1/Favorite', favorite);
  }

  /**
   * This method delete favorite workshop
   * @param id: number
   */
  deleteFavoriteWorkshop(id: number): Observable<object> {
    return this.http.delete(`/api/v1/Favorite/${id}`);
  }
}
