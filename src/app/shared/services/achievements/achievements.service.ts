import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Achievement, AchievementType } from '../../models/achievement.model';
import { ChildCards } from '../../models/child.model';

@Injectable({
  providedIn: 'root',
})
export class AchievementsService {
  constructor(private http: HttpClient) {}

  getAchievementsByWorkshopId(id: string): Observable<Achievement[]> {
    return this.http.get<Achievement[]>(`/api/v1/Achievement/GetByWorkshopId/${id}`);
  }

  getChildrenByWorkshopId(id: string): Observable<ChildCards> {
    return this.http.get<ChildCards>(`/api/v1/Child/GetApprovedByWorkshopId/${id}`);
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
