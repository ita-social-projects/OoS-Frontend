import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TeacherCard} from '../../models/teachers-card.model';

@Injectable({providedIn: 'root'})
export class TeacherCardsService {
  constructor(private http: HttpClient) {
  }

  getTeachersInfo(): Observable<TeacherCard[]>{
   return  this.http.get<TeacherCard[]>('/assets/mock-teachers-cards.json');
  }
}
