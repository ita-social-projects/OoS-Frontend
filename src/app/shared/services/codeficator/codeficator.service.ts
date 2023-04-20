import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Codeficator, CodeficatorCityDistrict } from '../../models/codeficator.model';
import { CodeficatorCategories } from '../../enum/codeficator-categories';

@Injectable({
  providedIn: 'root'
})
export class CodeficatorService {
  constructor(private http: HttpClient) {}

  /**
   * This method to get all Codeficators from the database
   * @param settlement string
   */
  public searchCodeficator(settlement: string, categories?: CodeficatorCategories[]): Observable<Codeficator[]> {
    if(!categories){
      return this.http.get<Codeficator[]>(`/api/v1/Codeficator/search?Name=${settlement}`);
    } else {
      const categoriesParam = categories?.join("");
  
      return this.http.get<Codeficator[]>(`/api/v1/Codeficator/search?Name=${settlement}&Categories=${categoriesParam}`);
    }
  }

  /**
   * This method to get Codeficator by id
   * @param id number
   */
  public getCodeficatorById(id: number): Observable<Codeficator> {
    return this.http.get<Codeficator>(`/api/v1/Codeficator/${id}/parents`);
  }

  /**
   * This method to get all Codeficator City Districts from the database
   * @param id number
   */
  public searchCodeficatorCityDistrict(id: number): Observable<CodeficatorCityDistrict[]> {
    return this.http.get<CodeficatorCityDistrict[]>(`/api/v1/Codeficator/children?id=${id}`);
  }

  /**
   * This method to get teh nearst settlemnt by coordinates
   * @param lat number
   * @param lon number
   */
  public getNearestByCoordinates(lat: number, lon: number): Observable<Codeficator> {
    let params = new HttpParams().set('Lat', lat.toString()).set('Lon', lon.toString());

    return this.http.get<Codeficator>('/api/v1/Codeficator/NearestByCoordinates', { params });
  }
}
