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
    return this.http.get<Direction[]>('/Direction/Get');
  }

  getTopDirections(): Observable<Direction[]> {
    return this.http.get<Direction[]>(`/Statistic/GetDirections`);
  }

  getDepartmentsBytDirectionId(id: number): Observable<Department[]> {
    return this.http.get<Department[]>(`/Department/GetByDirectionId/${id}`);
  }

  getClassByDepartmentId(id: number): Observable<IClass[]> {
    return this.http.get<IClass[]>(`/Class/GetByDepartmentId/${id}`);
  }
}