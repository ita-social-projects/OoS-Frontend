import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  dataUrlCategories = '/assets/mock-categories-cards.json';
  dataUrlIcons = '/assets/categories-icons.json';

  constructor(private http: HttpClient) { }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.dataUrlCategories);
  }

  getCategoriesIcons(): Observable<any> {
    return this.http.get(this.dataUrlIcons);
  }
}
