import { Observable } from 'rxjs';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';

import { Achievement, AchievementParameters, AchievementType } from '../../models/achievement.model';
import { Child } from '../../models/child.model';
import { SearchResponse } from '../../models/search.model';

@Injectable({
  providedIn: 'root'
})
export class AchievementsService {
  constructor(private http: HttpClient, private store: Store) {}

  getAchievementsByWorkshopId(achievementParameters: AchievementParameters): Observable<SearchResponse<Achievement[]>> {
    const params = new HttpParams()
      .set('WorkshopId', achievementParameters.workshopId)
      .set('From', achievementParameters.from.toString())
      .set('Size', achievementParameters.size.toString());

    return this.http.get<SearchResponse<Achievement[]>>(`/api/v1/Achievement/GetByWorkshopId`, { params });
  }

  getChildrenByWorkshopId(id: string): Observable<SearchResponse<Child[]>> {
    return this.http.get<SearchResponse<Child[]>>(`/api/v1/workshop/${id}/children/approved/`);
  }

  createAchievement(achievement: Achievement): Observable<Achievement> {
    return this.http.post<Achievement>('/api/v1/Achievement/Create', achievement);
  }

  updateAchievement(achievement: Achievement): Observable<Achievement> {
    return this.http.put<Achievement>('/api/v1/Achievement/Update', achievement);
  }

  deleteAchievement(id: string): Observable<void> {
    return this.http.delete<void>(`/api/v1/Achievement/Delete/${id}`);
  }

  getAchievementsType(): Observable<AchievementType[]> {
    return this.http.get<AchievementType[]>('/api/v1/AchievementType/GetAll');
  }

  getAchievementById(achievementId: string): Observable<Achievement> {
    return this.http.get<Achievement>(`/api/v1/Achievement/GetById/${achievementId}`);
  }
}
