import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { City } from '../../../models/city.model';

@Injectable({
  providedIn: 'root'
})
export class CityFilterService {

  dataUrl = '/assets/mock-cities.json';

  constructor(private http: HttpClient) { }

  fetchCities(): Observable<City[]>{
    return this.http.get<City[]>(this.dataUrl)
      .pipe(map((data)=>{
        return data;
      }))
    }
}
