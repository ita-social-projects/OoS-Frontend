import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { FeaturesList } from 'shared/models/features-list.model';
import { TruncatedItem } from 'shared/models/item.model';
import { ProviderParameters } from 'shared/models/provider.model';
import { PaginationParameters } from 'shared/models/query-parameters.model';
import { SearchResponse } from 'shared/models/search.model';
import { Workshop, WorkshopCard, WorkshopCardParameters, WorkshopProviderViewCard, WorkshopStatus } from 'shared/models/workshop.model';
import { MetaDataState } from 'shared/store/meta-data.state';

@Injectable({
  providedIn: 'root'
})
export class UserWorkshopService {
  private isImagesFeature: boolean;

  constructor(
    private http: HttpClient,
    private store: Store
  ) {}

  /**
   * This method get related workshops for employees personal cabinet
   */
  public getEmployeesWorkshops(parameters: PaginationParameters): Observable<SearchResponse<WorkshopProviderViewCard[]>> {
    const params = new HttpParams().set('From', parameters.from.toString()).set('Size', parameters.size.toString());

    return this.http.get<SearchResponse<WorkshopProviderViewCard[]>>('/api/v1/Employees/ManagedWorkshops', { params });
  }

  /**
   * This method get related workshops for provider personal cabinet
   */
  public getProviderViewWorkshops(workshopCardParameters: WorkshopCardParameters): Observable<SearchResponse<WorkshopProviderViewCard[]>> {
    const params = new HttpParams().set('From', workshopCardParameters.from.toString()).set('Size', workshopCardParameters.size.toString());

    return this.http.get<SearchResponse<WorkshopProviderViewCard[]>>(
      `/api/v1/Workshop/GetWorkshopProviderViewCardsByProviderId/${workshopCardParameters.providerId}`,
      {
        params
      }
    );
  }

  /**
   * This method get workshops by Provider id for details page
   */
  public getWorkshopsByProviderId(providerParameters: ProviderParameters): Observable<SearchResponse<WorkshopCard[]>> {
    let params = new HttpParams().set('From', providerParameters.from.toString()).set('Size', providerParameters.size.toString());

    if (providerParameters.excludedWorkshopId) {
      params = params.set('ExcludedId', providerParameters.excludedWorkshopId);
    }

    return this.http.get<SearchResponse<WorkshopCard[]>>(`/api/v1/Workshop/GetByProviderId/${providerParameters.providerId}`, { params });
  }

  /**
   * This method get workshops by Workshop id
   * @param id string
   */
  public getWorkshopById(id: string): Observable<Workshop> {
    return this.http.get<Workshop>(`/api/v1/Workshop/GetById/${id}`);
  }

  public getWorkshopListByProviderId(id: string): Observable<TruncatedItem[]> {
    return this.http.get<TruncatedItem[]>(`/api/v1/Workshop/GetWorkshopListByProviderId/${id}`);
  }

  public getWorkshopCompetitiveSelectionDescriptionById(id: string): Observable<string> {
    return this.http.get(`/api/v1/Workshop/GetCompetitiveSelectionDescription/${id}`, { responseType: 'text' });
  }

  public getWorkshopListByEmployeeId(id: string): Observable<TruncatedItem[]> {
    return this.http.get<TruncatedItem[]>(`/api/v1/Workshop/GetWorkshopListByEmployeeId/${id}`);
  }

  /**
   * This method create workshop
   * @param workshop Workshop
   */
  public createWorkshop(workshop: Workshop): Observable<Workshop> {
    this.isImagesFeature = this.store.selectSnapshot<FeaturesList>(MetaDataState.featuresList).images;
    return this.isImagesFeature ? this.createWorkshopV2(workshop) : this.createWorkshopV1(workshop);
  }

  public createWorkshopV1(workshop: Workshop): Observable<Workshop> {
    return this.http.post<Workshop>('/api/v1/Workshop/Create', workshop);
  }

  public createWorkshopV2(workshop: Workshop): Observable<Workshop> {
    const formData = this.createFormData(workshop);
    return this.http.post<Workshop>('/api/v2/Workshop/Create', formData);
  }

  /**
   * This method update workshop
   * @param workshop Workshop
   */
  public updateWorkshop(workshop: Workshop): Observable<Workshop> {
    this.isImagesFeature = this.store.selectSnapshot<FeaturesList>(MetaDataState.featuresList).images;
    return this.isImagesFeature ? this.updateWorkshopV2(workshop) : this.updateWorkshopV1(workshop);
  }

  public updateWorkshopV1(workshop: Workshop): Observable<Workshop> {
    return this.http.put<Workshop>('/api/v1/Workshop/Update', workshop);
  }

  public updateWorkshopV2(workshop: Workshop): Observable<Workshop> {
    const formData = this.createFormData(workshop);
    return this.http.put<Workshop>('/api/v2/Workshop/Update', formData);
  }

  /**
   * This method update workshop status
   * @param workshopStatus WorkshopStatus
   */
  public updateWorkshopStatus(workshopStatus: WorkshopStatus): Observable<WorkshopStatus> {
    return this.http.put<WorkshopStatus>('/api/v1/Workshop/UpdateStatus', workshopStatus);
  }

  public deleteWorkshop(id: string): Observable<void> {
    return this.http.delete<void>(`/api/v1/Workshop/Delete/${id}`);
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
