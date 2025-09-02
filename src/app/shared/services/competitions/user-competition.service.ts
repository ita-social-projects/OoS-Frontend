import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import {
  Competition,
  CompetitionCardParameters,
  CompetitionDraft,
  CompetitionDraftCard,
  CompetitionProviderViewCard,
  EditCompetitionDraft
} from 'shared/models/competition.model';
import { FeaturesList } from 'shared/models/features-list.model';
import { SearchResponse } from 'shared/models/search.model';
import { MetaDataState } from 'shared/store/meta-data.state';

@Injectable({
  providedIn: 'root'
})
export class UserCompetitionService {
  private isImagesFeature: boolean;

  constructor(
    private http: HttpClient,
    private store: Store
  ) {}

  /**
   * This method get competitions by Competition id
   * @param id string
   */
  public getCompetitionById(id: string): Observable<Competition> {
    return this.http.get<Competition>(`/api/v1/CompetitiveEvent/${id}`);
  }

  public getCompetitionDraftById(id: string): Observable<CompetitionDraft> {
    return this.http.get<CompetitionDraft>(`/api/v2/competitions-drafts/${id}`);
  }

  public getCompetitionDraftIdByCompetitionId(competitionId: string): Observable<string> {
    return this.http.get<string>(`/api/v2/competitions-drafts/event/${competitionId}/draft-id`);
  }

  /**
   * This method get related competitions for provider personal cabinet
   */
  public getProviderViewCompetitions(
    competitionCardParameters: CompetitionCardParameters
  ): Observable<SearchResponse<CompetitionProviderViewCard[]>> {
    const params = new HttpParams()
      .set('From', competitionCardParameters.from.toString())
      .set('Size', competitionCardParameters.size.toString());
    return this.http.get<SearchResponse<CompetitionProviderViewCard[]>>(
      `/api/v1/provider/${competitionCardParameters?.providerId}/competitiveevents`,
      {
        params
      }
    );
  }

  /**
   * This method get related competition drafts for provider personal cabinet
   */
  // eslint-disable-next-line max-len
  public getProviderViewCompetitionDrafts(
    competitionCardParameters: CompetitionCardParameters
  ): Observable<SearchResponse<CompetitionDraftCard[]>> {
    const params = new HttpParams()
      .set('From', competitionCardParameters.from.toString())
      .set('Size', competitionCardParameters.size.toString());

    return this.http.get<SearchResponse<CompetitionDraftCard[]>>(
      `/api/v2/provider/${competitionCardParameters.providerId}/competitions-drafts`,
      {
        params
      }
    );
  }

  public sendDraftForModeration(id: string): Observable<void> {
    return this.http.put<void>(`/api/v2/competitions-drafts/${id}/send-for-moderation`, {});
  }

  public updateDraft(draftId: string, draft: Competition): Observable<CompetitionDraft> {
    const formData = this.createFormData(draft, draftId);
    return this.http.put<CompetitionDraft>(`/api/v2/competitions-drafts/${draftId}`, formData);
  }

  public deleteCompetitionDraft(id: string): Observable<void> {
    return this.http.delete<void>(`/api/v2/competitions-drafts/${id}`);
  }

  /**
   * This method create competition
   * @param competition Competition
   */
  public createCompetition(competition: Competition): Observable<CompetitionDraft> {
    return this.createCompetitionV2(competition);
  }

  public createCompetitionV2(competition: Competition): Observable<CompetitionDraft> {
    return this.http.post<CompetitionDraft>('/api/v2/competitions-drafts', this.createFormData(competition));
  }

  /**
   * This method update competition
   * @param competition Competition
   */

  public updateCompetition(competition: Competition): Observable<Competition> {
    this.isImagesFeature = this.store.selectSnapshot<FeaturesList>(MetaDataState.featuresList).images;
    return this.isImagesFeature ? this.updateCompetitionV2(competition) : this.updateCompetitionV1(competition);
  }

  public updateCompetitionV1(competition: Competition): Observable<Competition> {
    return this.http.put<Competition>('/api/v1/CompetitiveEvent', competition);
  }

  public updateCompetitionV2(competition: Competition): Observable<Competition> {
    const formData = this.createFormData(competition);
    return this.http.put<Competition>('/api/v2/CompetitiveEvent/Update', formData);
  }

  public archiveCompetitionById(id: string): Observable<void> {
    return this.http.delete<void>(`/api/v2/CompetitiveEvent/Delete/${id}`);
  }

  public rejectCompetitionDraft(draftId: string, rejectReason: string): Observable<void> {
    draftId = encodeURIComponent(draftId);
    return this.http.put<void>(`/api/v2/competitions-drafts/${draftId}/reject`, { rejectionMessage: rejectReason });
  }

  public approveCompetitionDraft(draftId: string): Observable<void> {
    draftId = encodeURIComponent(draftId);
    return this.http.put<void>(`/api/v2/competitions-drafts/${draftId}/approve`, null);
  }

  public deleteCoverImageByCompetitionDraftId(draftId: string): Observable<void> {
    return this.http.delete<void>(`/api/v2/competitions-drafts/${draftId}/cover-image`);
  }

  public deleteImageByCompetitionDraftId(draftId: string, imageId: string): Observable<void> {
    return this.http.delete<void>(`/api/v2/competitions-drafts/${draftId}/images`, { body: [imageId] });
  }

  public editCompetitionDraftByModerator(formData: EditCompetitionDraft, draftId: string): Observable<void> {
    return this.http.put<void>(`/api/v2/competitions-drafts/${draftId}/moderator-edit`, formData);
  }

  private createFormData(competition: Competition, draftId?: string): FormData {
    const preKey = draftId ? 'CompetitiveEventV2Dto.' : '';
    const formData = new FormData();
    const formNames = ['contacts', 'competitiveEventDescriptionItems', 'judges', 'subDirectionIds'];
    const imageFiles = ['imageFiles', 'coverImage'];

    Object.keys(competition).forEach((key: string) => {
      if (competition[key] !== null && competition[key] !== undefined) {
        if (imageFiles.includes(key)) {
          competition[key].forEach((file: File) => formData.append(`${preKey}${key}`, file));
        } else if (formNames.includes(key)) {
          formData.append(`${preKey}${key}`, JSON.stringify(competition[key]));
        } else {
          formData.append(`${preKey}${key}`, competition[key]);
        }
      }
    });

    if (draftId) {
      formData.append('id', draftId);
    }

    return formData;
  }
}
