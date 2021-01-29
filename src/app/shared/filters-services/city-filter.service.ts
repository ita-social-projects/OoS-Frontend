import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const url='https://raw.githubusercontent.com/russ666/all-countries-and-cities-json/6ee538beca8914133259b401ba47a550313e8984/countries.json' //fake url
@Injectable({
  providedIn: 'root'
})
export class CityFilterService {

  constructor(private http: HttpClient) { }

  fetchCities(): Observable<any>{
      return this.http.get<any>(url)
        .pipe(map((data)=>{
          return data.Ukraine;
        }))
    }
}
