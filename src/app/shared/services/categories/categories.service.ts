import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Class, Department, Direction } from '../../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http: HttpClient) { }

  getDirections(): Observable<Direction[]> {
    return this.http.get<Direction[]>('/Direction/Get');
  }

  getDepartmentsBytDirectionId(id: number): Observable<Department[]> {
    return this.http.get<Department[]>(`/Department/GetByDirectionId/${id}`);
  }

  getClassByDepartmentId(id: number): Observable<Class[]> {
    return this.http.get<Class[]>(`/Class/GetByDepartmentId/${id}`);
  }
}