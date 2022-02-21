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
  createDirection(direction: Direction): Observable<Direction> {
    return this.http.post<Direction>('/api/v1/Direction/Create', direction);
  }
  createDepartment(department: Department): Observable<object> {
    return this.http.post('/api/v1/Department/Create', department);
  }
  updateDirection(direction: Direction): Observable<object> {
    return this.http.put('/api/v1/Direction/Update', direction);
  }
  deleteDirection(id: number): Observable<object> {
    return this.http.delete(`/api/v1/Direction/Delete/${id}`);
  }

  getDepartmentsByDirectionId(id: number): Observable<Department[]> {
    return this.http.get<Department[]>(`/api/v1/Department/GetByDirectionId/${id}`);
  }

  getClassByDepartmentId(id: number): Observable<IClass[]> {
    return this.http.get<IClass[]>(`/api/v1/Class/GetByDepartmentId/${id}`);
  }

  getDirectionById(id: number): Observable<Direction> {
    return this.http.get<Direction>(`/api/v1/Direction/GetById/${id}`);
  }
}
