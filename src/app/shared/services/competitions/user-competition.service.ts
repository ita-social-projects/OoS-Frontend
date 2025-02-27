import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Competition, CompetitionProviderViewCard } from 'shared/models/competition.model';
import { FeaturesList } from 'shared/models/features-list.model';
import { SearchResponse } from 'shared/models/search.model';
import { MetaDataState } from 'shared/store/meta-data.state';
import { CompetitionCardParameters } from './../../models/competition.model';

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
   * This method create competition
   * @param competition Competition
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

  public deleteCompetitionById(id: string): Observable<any> {
    return this.http.delete(`/api/v1/CompetitiveEvent/${id}`);
  }

  private createFormData(competition: Competition): FormData {
    const formData = new FormData();
    const formNames = ['contacts', 'competitiveEventDescriptionItems'];
    const imageFiles = ['imageFiles', 'coverImage'];
    const judges = 'judges';

    Object.keys(competition).forEach((key: string) => {
      if (imageFiles.includes(key)) {
        competition[key].forEach((file: File) => formData.append(key, file));
      } else if (formNames.includes(key)) {
        formData.append(key, JSON.stringify(competition[key]));
      } else if (key === judges) {
        for (let i = 0; i < competition.judges.length; i++) {
          Object.keys(competition.judges[i]).forEach((teacherKey: string) => {
            formData.append(`${judges}[${i}].${teacherKey}`, competition.judges[i][teacherKey]);
          });
        }
      } else {
        formData.append(key, competition[key]);
      }
    });
    return formData;
  }
}
