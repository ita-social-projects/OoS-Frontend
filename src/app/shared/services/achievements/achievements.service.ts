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

  createAchievement(achievement: Achievement): Observable<object> {
    return this.http.post('/api/v1/Achievement/Create', achievement);
  }

  deleteAchievement(id: string): Observable<object> {
    return this.http.delete(`/api/v1/Achievement/Delete/${id}`);
  }

  getAchievementType(): Observable<AchievementType[]> {
    return this.http.get<AchievementType[]>('/api/v1/AchievementType/GetAll');
  }
}
