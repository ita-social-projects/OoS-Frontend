import { SearchResponse } from './../../models/search.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { PaginationElement } from '../../models/paginationElement.model';
import { Rate } from '../../models/rating';
import { PaginatorState } from '../../store/paginator.state';

@Injectable({
  providedIn: 'root',
})
export class RatingService {
  constructor(private http: HttpClient, private store: Store) {}

  /**
   * This method get Rate pf entity by its entityId
   * @param entityType: string
   * @param entityId: string
   */
  setParams(): HttpParams {
    let params = new HttpParams();
    const currentPage = this.store.selectSnapshot(PaginatorState.currentPage) as PaginationElement;
    const size = this.store.selectSnapshot(PaginatorState.ratingPerPage);
    const from = size * (+currentPage.element - 1);

    params = params.set('Size', size.toString()).set('From', from.toString());
    return params;
  }

  getRateByEntityId(entityType: string, entityId: string): Observable<SearchResponse<Rate[]>> {
    const body = { params: this.setParams() };
    return this.http.get<SearchResponse<Rate[]>>(`/api/v1/Rating/GetByEntityId/${entityType}/${entityId}`, body);
  }

  /**
   * This method create Rate
   * @param rate: Rate
   */
  createRate(rate: Rate): Observable<Rate> {
    return this.http.post<Rate>('/api/v1/Rating/Create', rate);
  }

  /**
   * This method update Rate
   * @param rate: Rate
   */
  updateRate(rate: Rate): Observable<object> {
    return this.http.put('/api/v1/Rating/Update', rate);
  }

  /**
   * This method Check if the workshop is reviewed by parent.
   * @param parentId string
   * @param workshopId string
   */
  getReviewedStatus(parentId: string, workshopId: string): Observable<boolean> {
    return this.http.get<boolean>('/api/v1/Rating/IsReviewed', {
      params: {
        parentId,
        workshopId,
      },
    });
  }
}
