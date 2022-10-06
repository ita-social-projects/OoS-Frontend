import { ProviderWorkshopCard, WorkshopCard } from './../../../models/workshop.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Workshop, WorkshopStatus } from '../../../models/workshop.model';
import { FeaturesList } from '../../../models/featuresList.model';
import { MetaDataState } from '../../../store/meta-data.state';
import { TruncatedItem } from '../../../models/truncated.model';

@Injectable({
  providedIn: 'root',
})
export class UserWorkshopService {
  isRelease3: boolean;

  constructor(private http: HttpClient, private store: Store) {}

  /**
   * This method get related workshops for provider admins
   */
  getProviderAdminsWorkshops(): Observable<ProviderWorkshopCard[]> {
    return this.http.get<ProviderWorkshopCard[]>(`/api/v1/ProviderAdmin/ManagedWorkshops`);
  }

  /**
   * This method get related workshops for provider
   */
  getProviderWorkshops(id: string): Observable<ProviderWorkshopCard[]> {
    return this.http.get<ProviderWorkshopCard[]>(`/api/v1/Workshop/GetWorkshopProviderViewCardByproviderId/${id}`);
  }

  /**
   * This method get workshops by Provider id
   * @param id: string
   */
  getWorkshopsByProviderId(id: string, excludedWorkshopId?: string): Observable<WorkshopCard[]> {
    let params = new HttpParams();
    if (excludedWorkshopId) {
      params = params.set('excludedWorkshopId', excludedWorkshopId);
    }

    return this.http.get<WorkshopCard[]>(`/api/v1/Workshop/GetByProviderId/${id}`, { params });
  }

  /**
   * This method get workshops by Workshop id
   * @param id: string
   */
  getWorkshopById(id: string): Observable<Workshop> {
    return this.http.get<Workshop>(`/api/v1/Workshop/GetById/${id}`);
  }

  getWorkshopListByProviderId(id: string): Observable<TruncatedItem[]>{
    return this.http.get<TruncatedItem[]>(`/api/v1/Workshop/GetWorkshopListByProviderId/${id}`);
  }

  /**
   * This method create workshop
   * @param workshop: Workshop
   */
  createWorkshop(workshop: Workshop): Observable<Workshop> {
    this.isRelease3 = this.store.selectSnapshot<FeaturesList>(MetaDataState.featuresList).release3;
    return this.isRelease3 ? this.createWorkshopV2(workshop) : this.createWorkshopV1(workshop);
  }

  createWorkshopV1(workshop: Workshop): Observable<Workshop> {
    return this.http.post<Workshop>('/api/v1/Workshop/Create', workshop);
  }

  createWorkshopV2(workshop: Workshop): Observable<Workshop> {
    const formData = this.createFormData(workshop);
    return this.http.post<Workshop>('/api/v2/Workshop/Create', formData);
  }

  /**
   * This method update workshop
   * @param workshop: Workshop
   */
  updateWorkshop(workshop: Workshop): Observable<Workshop> {
    this.isRelease3 = this.store.selectSnapshot<FeaturesList>(MetaDataState.featuresList).release2;
    return this.isRelease3 ? this.updateWorkshopV2(workshop) : this.updateWorkshopV1(workshop);
  }

  updateWorkshopV1(workshop: Workshop): Observable<Workshop> {
    return this.http.put<Workshop>('/api/v1/Workshop/Update', workshop);
  }

  updateWorkshopV2(workshop: Workshop): Observable<Workshop> {
    const formData = this.createFormData(workshop);
    return this.http.put<Workshop>('/api/v2/Workshop/Update', formData);
  }

  /**
   * This method update workshop status
   * @param workshopStatus: WorkshopStatus
   */
  updateWorkshopStatus(workshopStatus: WorkshopStatus): Observable<WorkshopStatus> {
    return this.http.put<WorkshopStatus>('/api/v1/Workshop/UpdateStatus', workshopStatus);
  }

  deleteWorkshop(id: string): Observable<void> {
    return this.http.delete<void>(`/api/v2/Workshop/Delete/${id}`);
  }

  private createFormData(workshop: Workshop): FormData {
    const formData = new FormData();
    const formNames = ['address', 'dateTimeRanges', 'keywords', 'imageIds', 'workshopDescriptionItems'];
    const imageFiles = ['imageFiles', 'coverImage'];
    const teachers = 'teachers';

    Object.keys(workshop).forEach((key: string) => {
      if (imageFiles.includes(key)) {
        workshop[key].forEach((file: File) => formData.append(key, file));
      } else if (formNames.includes(key)) {
        formData.append(key, JSON.stringify(workshop[key]));
      } else if (key === teachers) {
        for (let i = 0; i < workshop.teachers.length; i++) {
          Object.keys(workshop.teachers[i]).forEach((teacherKey: string) => {
            formData.append(`${teachers}[${i}].${teacherKey}`, workshop.teachers[i][teacherKey]);
          });
        }
      } else {
        formData.append(key, workshop[key]);
      }
    });

    return formData;
  }
}
