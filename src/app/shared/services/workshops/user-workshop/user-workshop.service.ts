import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { FeaturesList } from 'shared/models/features-list.model';
import { TruncatedItem } from 'shared/models/item.model';
import { ProviderParameters } from 'shared/models/provider.model';
import { PaginationParameters } from 'shared/models/query-parameters.model';
import { SearchResponse } from 'shared/models/search.model';
import {
  Workshop,
  WorkshopCard,
  WorkshopCardParameters,
  WorkshopDraft,
  WorkshopDraftCard,
  WorkshopProviderViewCard,
  WorkshopStatus
} from 'shared/models/workshop.model';
import { MetaDataState } from 'shared/store/meta-data.state';
import { BaseWorkshop } from 'shared/models/draftWorkshop.model';

@Injectable({
  providedIn: 'root'
})
export class UserWorkshopService {
  private isImagesFeature: boolean;

  constructor(
    private readonly http: HttpClient,
    private readonly store: Store
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
    let params = new HttpParams().set('From', workshopCardParameters.from.toString()).set('Size', workshopCardParameters.size.toString());

    if (workshopCardParameters.searchText) {
      params = params.set('SearchText', workshopCardParameters.searchText);
    }

    return this.http.get<SearchResponse<WorkshopProviderViewCard[]>>(
      `/api/v1/Workshop/GetWorkshopProviderViewCardsByProviderId/${workshopCardParameters.providerId}`,
      {
        params
      }
    );
  }

  /**
   * This method get related workshop drafts for provider personal cabinet
   */
  public getProviderViewWorkshopDrafts(workshopCardParameters: WorkshopCardParameters): Observable<SearchResponse<WorkshopDraftCard[]>> {
    const params = new HttpParams().set('From', workshopCardParameters.from.toString()).set('Size', workshopCardParameters.size.toString());

    return this.http.get<SearchResponse<WorkshopDraftCard[]>>(
      `/api/v2/WorkshopDraft/GetByProviderId/provider/${workshopCardParameters.providerId}/drafts`,
      {
        params
      }
    );
  }

  public getWorkshopDraftById(id: string): Observable<WorkshopDraft> {
    return this.http.get<WorkshopDraft>(`/api/v2/WorkshopDraft/Get/drafts/${id}`);
  }

  public getWorkshopDraftIdByWorkshopId(workshopId: string): Observable<string> {
    return this.http.get<string>(`/api/v2/WorkshopDraft/GetWorkshopDraftIdByWorkshopId/${workshopId}`);
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

  public sendDraftForModeration(id: string): Observable<void> {
    return this.http.put<void>(`/api/v2/WorkshopDraft/SendForModeration/${id}`, {});
  }

  public getWorkshopCompetitiveSelectionDescriptionById(id: string): Observable<string> {
    return this.http.get(`/api/v1/Workshop/GetCompetitiveSelectionDescription/${id}`, { responseType: 'text' });
  }

  public getWorkshopListByEmployeeId(id: string): Observable<TruncatedItem[]> {
    return this.http.get<TruncatedItem[]>(`/api/v1/Workshop/GetWorkshopListByEmployeeId/${id}`);
  }

  /**
   * This method create workshop draft
   * @param workshop Workshop
   */
  public createWorkshopDraft(workshop: Workshop): Observable<Workshop> {
    return this.createWorkshopDraftV2(workshop);
  }

  public createWorkshopDraftV2(workshop: Workshop): Observable<Workshop> {
    return this.http.post<Workshop>('/api/v2/WorkshopDraft/Create', this.createFormData(workshop));
  }

  public updateDraft(draftId: string, draft: Workshop): Observable<WorkshopDraft> {
    return this.updateDraftV2(draftId, draft);
  }

  public updateDraftV2(draftId: string, draft: Workshop): Observable<WorkshopDraft> {
    const formData = this.createFormData(draft, draftId);
    return this.http.put<WorkshopDraft>('/api/v2/WorkshopDraft/Update', formData);
  }

  public deleteWorkshopDraft(id: string): Observable<void> {
    return this.http.delete<void>(`/api/v2/WorkshopDraft/Delete/${id}`);
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

  public publishWorkshop(id: string): Observable<void> {
    return this.http.put<void>('/api/v1/Workshop/Publish', id);
  }

  public saveWorkshopStep<T extends BaseWorkshop>(data: T): Observable<string> {
    return this.http.post<string>('/api/v1/WorkshopTempSave/Store', data, { responseType: 'text' as 'json' });
  }

  public deleteUnfinishedWorkshop(): Observable<void> {
    return this.http.delete<void>('/api/v1/WorkshopTempSave/Remove');
  }

  public getUnfinishedWorkshop(): Observable<Workshop> {
    return this.http.get<Workshop>('/api/v1/WorkshopTempSave/Restore');
  }

  public getTimeToLiveOfUnfinishedWorkshop(): Observable<string> {
    return this.http.get<string>('/api/v1/WorkshopTempSave/GetTimeToLive');
  }

  public rejectWorkshopDraft(draftId: string, rejectReason: string): Observable<void> {
    return this.http.put<void>(`/api/v2/WorkshopDraft/Reject/${draftId}`, { rejectionMessage: rejectReason });
  }

  public approveWorkshopDraft(draftId: string): Observable<void> {
    return this.http.put<void>(`/api/v2/WorkshopDraft/Approve/${draftId}`, null);
  }

  private createFormData(workshop: Workshop, draftId?: string): FormData {
    const preKey = draftId ? 'WorkshopV2Dto.' : '';
    const formData = new FormData();
    const formNames = ['dateTimeRanges', 'keywords', 'imageIds', 'workshopDescriptionItems', 'tagIds', 'teachers', 'contacts'];
    const imageFiles = ['imageFiles', 'coverImage'];
    const skipNullKeys = ['maxAge', 'minAge'];

    Object.keys(workshop).forEach((key: string) => {
      if (imageFiles.includes(key)) {
        workshop[key].forEach((file: File) => formData.append(`${preKey}${key}`, file));
      } else if (formNames.includes(key)) {
        formData.append(`${preKey}${key}`, JSON.stringify(workshop[key]));
      } else if (!(skipNullKeys.includes(key) && workshop[key] === null)) {
        formData.append(`${preKey}${key}`, workshop[key]);
      }
    });

    if (draftId) {
      formData.append('id', draftId);
    }

    return formData;
  }
}
