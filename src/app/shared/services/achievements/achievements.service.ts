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

  /**
   * This method get achievements by workshop id
   * @param id: string
   */
  getAchievementsByWorkshopId(id: string): Observable<Achievement[]> {
    return this.http.get<Achievement[]>(`/api/v1/Achievement/GetByWorkshopId/${id}`);
  }

  /**
  * This method get children by workshop id
  * @param id: string
  */
  getChildrenByWorkshopId(id: string): Observable<ChildCards> {
    return this.http.get<ChildCards>(`/api/v1/Child/GetApprovedByWorkshopId/${id}`);
  }

  /**
   * This method create Achievement
   * @param achievement: Achievement
   */
  createAchievement(achievement: Achievement): Observable<object> {
    return this.http.post('/api/v1/Achievement/Create', achievement);
  }

  /**
  * This method update Achievement
  * @param achievement: Achievement
  */
    updateAchievement(achievement: Achievement): Observable<object> {
    return this.http.put('/api/v1/Achievement/Update', achievement);
  }

  /**
  * This method delete achievement by Achievement id
  * @param id: string
  */
  deleteAchievement(id: string): Observable<object> {
    return this.http.delete(`/api/v1/Achievement/Delete/${id}`);
  }

  /**
  * This method get all Achievements types
  */
  getAchievementsType(): Observable<AchievementType[]> {
    return this.http.get<AchievementType[]>('/api/v1/AchievementType/GetAll');
  }
}
