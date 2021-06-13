import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Teacher } from '../../models/teacher.model';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  constructor(private http: HttpClient) { }

  /**
  * This method get teachers by User id
  * @param id
  */
  getTeachersById(id: number): Observable<Teacher[]> {
    const dataUrl = `/Workshop/GetById/${id}`;
    return this.http.get<Teacher[]>(`/Workshop/GetById/${id}`);
  }

  /**
  * This method create teacher
  * @param Workshop
  */
  createTeacher(teacher: Teacher): Observable<Object> {
    return this.http.post('/Teacher/Create', teacher);
  }

  /**
  * This method delete teacher by Teacher id
  * @param id
  */
  deleteWorkshop(id: number): Observable<Object> {
    const dataUrl = `Teacher/Delete/${id}`;
    return this.http.delete(dataUrl);
  }
}
