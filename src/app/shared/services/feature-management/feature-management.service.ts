import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { FeaturesList } from 'shared/models/features-list.model';

@Injectable({
  providedIn: 'root'
})
export class FeatureManagementService {
  constructor(private http: HttpClient) {}

  /**
   * This method get features flags depending on releases
   */
  public getFeaturesList(): Observable<FeaturesList> {
    return this.http.get<FeaturesList>('/api/v1/FeatureManagement/Get');
    // return of({
    //   release1: true,
    //   release2: false,
    //   release3: false,
    //   images: false,
    //   showForProduction: false
    // });
  }
}
