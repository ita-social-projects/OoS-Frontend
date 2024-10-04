import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Competition } from 'shared/models/competition.model';
import { FeaturesList } from 'shared/models/features-list.model';
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
    return this.http.get<Competition>(`/api/v1/Competition/GetById/${id}`);
  }

  /**
   * This method create competition
   * @param competition Competition
   */
  public createCompetition(competition: Competition): Observable<Competition> {
    this.isImagesFeature = this.store.selectSnapshot<FeaturesList>(MetaDataState.featuresList).images;
    return this.isImagesFeature ? this.createCompetitionV2(competition) : this.createCompetitionV1(competition);
  }

  public createCompetitionV1(competition: Competition): Observable<Competition> {
    return this.http.post<Competition>('/api/v1/Competition/Create', competition);
  }

  public createCompetitionV2(competition: Competition): Observable<Competition> {
    const formData = this.createFormData(competition);
    return this.http.post<Competition>('/api/v2/Competition/Create', formData);
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
    return this.http.put<Competition>('/api/v1/Competition/Update', competition);
  }

  public updateCompetitionV2(competition: Competition): Observable<Competition> {
    const formData = this.createFormData(competition);
    return this.http.put<Competition>('/api/v2/Competition/Update', formData);
  }

  private createFormData(competition: Competition): FormData {
    const formData = new FormData();
    const formNames = ['address'];
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
