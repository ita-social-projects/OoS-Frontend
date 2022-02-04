import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IClass, Department, Direction } from '../../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http: HttpClient) { }

  getDirections(): Observable<Direction[]> {
    return this.http.get<Direction[]>('/api/v1/Direction/Get');
  }

  getTopDirections(): Observable<Direction[]> {
    return this.http.get<Direction[]>(`/api/v1/Statistic/GetDirections`);
  }

  getDepartmentsBytDirectionId(id: number): Observable<Department[]> {
    return this.http.get<Department[]>(`/api/v1/Department/GetByDirectionId/${id}`);
  }

  getClassByDepartmentId(id: number): Observable<IClass[]> {
    return this.http.get<IClass[]>(`/api/v1/Class/GetByDepartmentId/${id}`);
  }
}
