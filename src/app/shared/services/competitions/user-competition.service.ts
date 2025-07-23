import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Competition, CompetitionDraftCard, CompetitionProviderViewCard } from 'shared/models/competition.model';
import { FeaturesList } from 'shared/models/features-list.model';
import { SearchResponse } from 'shared/models/search.model';
import { MetaDataState } from 'shared/store/meta-data.state';
import { CompetitionCardParameters } from 'shared/models/competition.model';

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

  /**
   * This method create competition
   * @param competition Competition
   */
  /**
   / * This method creates a competition.
   * todo: Update logic to use `createCompetitionV2` when the new version is available.
   */
  public createCompetition(competition: Competition): Observable<Competition> {
    this.isImagesFeature = this.store.selectSnapshot<FeaturesList>(MetaDataState.featuresList).images;
    // this code return when v2 for competition will be
    // return this.isImagesFeature ? this.createCompetitionV2(competition) : this.createCompetitionV1(competition);
    return this.createCompetitionV1(competition);
  }

  public createCompetitionV1(competition: Competition): Observable<Competition> {
    return this.http.post<Competition>('/api/v1/CompetitiveEvent', competition);
  }

  public createCompetitionV2(competition: Competition): Observable<Competition> {
    const formData = this.createFormData(competition);
    return this.http.post<Competition>('/api/v2/CompetitiveEvent', formData);
  }

  /**
   * This method update competition
   * @param competition Competition
   */
  /**
   / * This method creates a competition.
   * todo: Update logic to use `createCompetitionV2` when the new version is available.
   */
  public updateCompetition(competition: Competition): Observable<Competition> {
    this.isImagesFeature = this.store.selectSnapshot<FeaturesList>(MetaDataState.featuresList).images;
    // this code return when v2 for competition will be
    // return this.isImagesFeature ? this.updateCompetitionV2(competition) : this.updateCompetitionV1(competition);
    return this.updateCompetitionV1(competition);
  }

  public updateCompetitionV1(competition: Competition): Observable<Competition> {
    return this.http.put<Competition>('/api/v1/CompetitiveEvent', competition);
  }

  public updateCompetitionV2(competition: Competition): Observable<Competition> {
    const formData = this.createFormData(competition);
    return this.http.put<Competition>('/api/v2/CompetitiveEvent', formData);
  }

  public archiveCompetitionById(id: string): Observable<void> {
    return this.http.delete<void>(`/api/v2/CompetitiveEvent/Delete/${id}`);
  }

  private createFormData(competition: Competition): FormData {
    const formData = new FormData();
    const formNames = ['contacts', 'competitiveEventDescriptionItems', 'judges'];
    const imageFiles = ['imageFiles', 'coverImage'];

    Object.keys(competition).forEach((key: string) => {
      if (competition[key]) {
        if (imageFiles.includes(key)) {
          competition[key].forEach((file: File) => formData.append(key, file));
        } else if (formNames.includes(key)) {
          formData.append(key, JSON.stringify(competition[key]));
        } else {
          formData.append(key, competition[key]);
        }
      }
    });

    return formData;
  }
}
