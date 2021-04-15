import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { orgCard } from '../../models/org-card.model';
import { FilterStateModel } from '../../store/filter.state';


@Injectable({
  providedIn: 'root'
})
export class OrgCardsService {

  dataUrl = '/assets/mock-org-cards.json';
  // dataUrl = 'http://localhost:5000/Workshop/GetWorkshops';

  constructor(private http: HttpClient) { }

  private setParams(filters: FilterStateModel): HttpParams {
    let params = new HttpParams();
    if(filters.searchQuery){
      params = params.set('title', filters.searchQuery);
    }
    if(filters.city){
      params = params.set('address.city', filters.city.city);
    }
    if(filters.ageFrom > 0){
      params = params.set('minAge', filters.ageFrom.toString());
    }
    if(filters.ageTo < 16){
      params = params.set('maxAge', filters.ageTo.toString());
    }
    if(filters.categories.length > 0){
      for(let i = 0; i < filters.categories.length; i++){
        params = params.append('category.id', filters.categories[i].toString());
      }
    }
    return params;
  }

  getWorkshops(filters: FilterStateModel): Observable<orgCard[]> {
    const options = { params: this.setParams(filters) };
    return this.http.get<orgCard[]>(this.dataUrl, options);
  }

  getPopWorkshops(): Observable<orgCard[]> {
    return this.http.get<orgCard[]>(this.dataUrl);
  }
}
