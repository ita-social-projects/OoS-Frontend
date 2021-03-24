import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

  // setCity(city: string, params: HttpParams){
  //   if(city){
  //     return params.set('address.city', city);
  //   }
  // }
  setParams(filters: FilterStateModel): HttpParams {
    let params = new HttpParams();
    if(filters.searchQuery){
      params = params.set('title', filters.searchQuery);
      // params = params.set('provider.title', filters.searchQuery);
    }
    if(filters.city){
      params = params.set('address.city', filters.city);
    }
    if(filters.ageFrom > 0){
      params = params.set('minAge', filters.ageFrom.toString());
    }
    if(filters.ageTo < 16){
      params = params.set('maxAge', filters.ageTo.toString());
    }
    if(filters.categories.length > 0){
      for(let i = 0; i < filters.categories.length; i++){
        params = params.append('category.title', filters.categories[i]);
      }
    }
    return params;
  }

  getWorkshops(filters: FilterStateModel): Observable<orgCard[]> {
    const options = 
     { params: this.setParams(filters) };
    console.log(options);
    return this.http.get<orgCard[]>(this.dataUrl, options);
  }

  // getCards(filters: FilterStateModel): Observable<orgCard[]> {
  //   console.log(filters.toString());
  //   let params = new HttpParams();
  //   for(const [key, value] of Object.entries(filters)) {
  //     if(Array.isArray(value)){
  //       for(let i = 0; i < value.length; i++){
  //         params = params.append(key, value[i]);
  //       }
  //     } else {
  //       params = params.set(key, value);
  //     }
  //   }
  //   // if(filters !== null){
  //   //   if(filters.categories !== null && filters.categories.length > 0){
  //   //     for(let i = 0; i < filters.categories.length; i++){
  //   //       params = params.append('category', filters.categories[i]);
  //   //     }
  //   //   }
  //   //   if(filters.city){
  //   //     params = params.set('city', filters.city);
  //   //     // console.log("params:" + params.toString());
  //   //   }
  //   // }
  //   // params = params.set('city', 'Kyiv');
  //   // console.log("params:" + params.toString());
  //   // params1 = params1.append('city', 'Kyiv');
  //   // console.log("params1:" + params1.toString());
  //   // let params = new HttpParams();
 
  //   // params = params.append('category', "music");
  //    const options = { params: params };
  // //  const options = 
  //  //   { params: new HttpParams().set('city', filters.city)};
  // //  console.log(options);
  //   return this.http.get<orgCard[]>(this.dataUrl, options);
  // }

  getCards1(): Observable<orgCard[]> {
    return this.http.get<orgCard[]>(this.dataUrl);
  }
}
