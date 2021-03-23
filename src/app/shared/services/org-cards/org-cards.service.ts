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

  // getCards(filters: FilterStateModel): Observable<orgCard[]> {
  //   // console.log(filters);
  //   let params = new HttpParams();
  //   // console.log(filters.city);
  //   if(filters !== null){
  //     if(filters.categories !== null && filters.categories.length > 0){
  //       for(let i = 0; i < filters.categories.length; i++){
  //         params = params.append('category', filters.categories[i]);
  //       }
  //     }
  //     if(filters.city){
  //       params = params.set('city', filters.city);
  //       // console.log("params:" + params.toString());
  //     }
  //   }
  //   // params = params.set('city', 'Kyiv');
  //   // console.log("params:" + params.toString());
  //   // params1 = params1.append('city', 'Kyiv');
  //   // console.log("params1:" + params1.toString());
  //   // let params = new HttpParams();
 
  //   // params = params.append('category', "music");
  //    const options = { params: params };
  // //  const options = 
  //  //   { params: new HttpParams().set('city', filters.city)};
  //  console.log(options);
  //   return this.http.get<orgCard[]>(this.dataUrl, options);
  // }

  getCards1(): Observable<orgCard[]> {
    return this.http.get<orgCard[]>(this.dataUrl);
  }
}
