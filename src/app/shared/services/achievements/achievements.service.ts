import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Achievement, AchievementType } from '../../models/achievement.model';
import { Child } from '../../models/child.model';
import { SearchResponse } from '../../models/search.model';
import { PaginatorState } from '../../store/paginator.state';
import { PaginationElement } from '../../models/paginationElement.model';
import { Store } from '@ngxs/store';

@Injectable({
  providedIn: 'root',
})
export class AchievementsService {
  constructor(private http: HttpClient, private store: Store) {}

  getAchievementsByWorkshopId(id: string): Observable<SearchResponse<Achievement[]>> {
    let params = new HttpParams();
    const currentPage = this.store.selectSnapshot(PaginatorState.currentPage) as PaginationElement;
    const size = this.store.selectSnapshot(PaginatorState.achievementPerPage);
    const from = size * (+currentPage.element - 1);

    params = new HttpParams().set('WorkshopId', id).set('From', from.toString()).set('Size', size.toString());

    return this.http.get<SearchResponse<Achievement[]>>(`/api/v1/Achievement/GetByWorkshopId`, { params });
  }

  getChildrenByWorkshopId(id: string): Observable<SearchResponse<Child[]>> {
    return this.http.get<SearchResponse<Child[]>>(`/api/v1/Child/GetApprovedByWorkshopId/${id}`);
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
