import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { FeaturesList } from 'src/app/shared/models/featuresList.model';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';
import { Workshop, WorkshopCard } from '../../../models/workshop.model';

@Injectable({
  providedIn: 'root'
})
export class UserWorkshopService {
  isRelease2: boolean;

  constructor(
    private http: HttpClient,
    private store: Store) { }

  /**
   * This method get workshops by Provider id
   * @param id: string
   */
  getWorkshopsByProviderId(id: string): Observable<WorkshopCard[]> {
    return this.http.get<WorkshopCard[]>(`/api/v1/Workshop/GetByProviderId/${id}`);
  }

  /**
   * This method get workshops by Workshop id
   * @param id: string
   */
  getWorkshopById(id: string): Observable<Workshop> {
    return this.http.get<Workshop>(`/api/v1/Workshop/GetById/${id}`);
  }

  /**
   * This method create workshop
   * @param workshop: Workshop
   */
  createWorkshop(workshop: Workshop): Observable<object> {
    this.isRelease2 = this.store.selectSnapshot<FeaturesList>(MetaDataState.featuresList).release2;

    return this.isRelease2 ? this.createWorkshopV2(workshop) : this.createWorkshopV1(workshop);
  }

  createWorkshopV1(workshop: Workshop): Observable<object> {
    return this.http.post('/api/v1/Workshop/Create', workshop);
  }

  createWorkshopV2(workshop: Workshop): Observable<object> {
    const formData = new FormData();
    const formNames = ['address', 'dateTimeRanges', 'teachers', 'keywords'];
    const imageFiles = 'imageFiles';

    Object.keys(workshop).forEach((key: string) => {

      if (key === imageFiles) {
        workshop.imageFiles.forEach((file: File) => formData.append(imageFiles, file));
      } else if (formNames.includes(key)) {
        formData.append(key, JSON.stringify(workshop[key]));
      } else {
        formData.append(key, workshop[key]);
      }
    });

    return this.http.post('/api/v2/Workshop/Create', formData);
  }

  /**
   * This method delete workshop by Workshop id
   * @param id: string
   */
  deleteWorkshop(id: string): Observable<object> {
    return this.http.delete(`/api/v1/Workshop/Delete/${id}`);
  }

  /**
   * This method update workshop
   * @param workshop: Workshop
   */
  updateWorkshop(workshop: Workshop): Observable<object> {
    return this.http.put('/api/v1/Workshop/Update', workshop);
  }

}
