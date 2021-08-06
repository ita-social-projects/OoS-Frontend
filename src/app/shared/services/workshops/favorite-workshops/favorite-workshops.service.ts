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
  * This method get all favorite workshops  
  */
  getAllFavoriteWorkshops(): Observable<Favorite[]> {
    return this.http.get<Favorite[]>('/Favorite/all');
  }

  /**
  * This method get favorite workshops  
  */
  getFavoriteWorkshops(): Observable<Favorite[]> {
    return this.http.get<Favorite[]>('/Favorite');
  }

   /**
  * This method get favorite workshops by Userid 
  */
  getFavoriteWorkshopsByUserId(): Observable<WorkshopFavoriteCard> {
    return this.http.get<WorkshopFavoriteCard>('/Favorite/workshops');
  }

  /**
  * This method get favorite workshop by id
  * @param id
  */
  getFavoriteWorkshopById(id: number): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(`/Favorite/${id}`);
  }

  /**
  * This method create favorite workshop
  * @param favorite 
  */
  createFavoriteWorkshop(favorite: Favorite): Observable<Object> {
    return this.http.post('/Favorite', favorite);
  }

  /**
  * This method delete favorite workshop
  * @param id 
  */
   deleteFavoriteWorkshop(id: number): Observable<Object> {
    return this.http.delete(`/Favorite/${id}`);
  }

  /**
  * This method update favorite workshop
  * @param favorite 
  */
   updateFavoriteWorkshop(favorite: Favorite): Observable<Object> {
    return this.http.put('/Favorite', favorite);
  }
}
