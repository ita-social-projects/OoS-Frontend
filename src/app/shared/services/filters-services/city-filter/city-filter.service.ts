import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CityFilterService {

  dataUrl = '/assets/mock-cities.json';

  constructor(private http: HttpClient) { }

  fetchCities(): Observable<any>{
    return this.http.get<any>(this.dataUrl)
      .pipe(map((data)=>{
        return data;
      }))
    }
}
