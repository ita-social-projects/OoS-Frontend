import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Achievement } from '../../models/achievement.model';

@Injectable({
  providedIn: 'root',
})
export class AchievementsService {
  constructor(private http: HttpClient) {}

  getAchievementsByWorkshopId(id: string): Observable<Achievement[]> {
    return this.http.get<Achievement[]>(
      `/api/v1//api/v1/Achievement/GetByWorkshopId/${id}`
    );
  }

  createAchievement(achievement: Achievement): Observable<Object> {
    return this.http.post('/api/v1/Achievement/Create', achievement);
  }
}
