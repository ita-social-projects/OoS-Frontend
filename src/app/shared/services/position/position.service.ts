import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Position, PositionParameters } from 'shared/models/position.model';
import { SearchResponse } from 'shared/models/search.model';

@Injectable({
  providedIn: 'root'
})
export class PositionService {
  private readonly baseUrl: string = '/api/v1/providers';

  constructor(private readonly http: HttpClient) {}

  public getPositions(parameters: PositionParameters): Observable<SearchResponse<Position[]>> {
    let params = new HttpParams()
      .set('SearchString', parameters.searchString || '')
      .set('From', parameters.from.toString() || '0')
      .set('Size', parameters.size?.toString() || '10');
    if (typeof parameters.OrderByCreatedAt === 'boolean') {
      params = params.set('OrderByCreatedAt', parameters.OrderByCreatedAt);
    }
    if (typeof parameters.OrderByFullName === 'boolean') {
      params = params.set('OrderByFullName', parameters.OrderByFullName);
    }
    return this.http.get<SearchResponse<Position[]>>(`${this.baseUrl}/${parameters.providerId}/positions/GetByFilter`, { params });
  }

  public createPosition(position: Position): Observable<Position> {
    return this.http.post<Position>(`${this.baseUrl}/${position.providerId}/positions/Create`, position);
  }

  public updatePosition(position: Position): Observable<Position> {
    return this.http.put<Position>(`${this.baseUrl}/${position.providerId}/positions/Update/${position.id}`, position);
  }

  public deletePosition(positionParameters: PositionParameters, positionId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${positionParameters.providerId}/positions/Delete/${positionId}`);
  }

  public getPositionById(positionId: string, providerId: string): Observable<Position> {
    if (!providerId) {
      return throwError(() => new Error('Provider ID is not available'));
    }

    return this.http.get<Position>(`${this.baseUrl}/${providerId}/positions/GetById/${positionId}`);
  }
}
