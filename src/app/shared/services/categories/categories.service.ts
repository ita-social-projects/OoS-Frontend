import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category, Subcategory, Subsubcategory } from '../../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  dataUrlCategories = '/assets/mock-categories-cards.json';
  dataUrlIcons = '/assets/categories-icons.json';
  dataUrl = '/Category/Get';

  constructor(private http: HttpClient) { }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.dataUrl);
  }
  getCategoryId(id: number): Observable<Category[]> {
    return this.http.get<Category[]>(`/Category/GetById/${id}`);
  }

  getSubcategory(): Observable<Subcategory[]> {
    return this.http.get<Subcategory[]>('/Subcategory/Get');
  }

  getBySubcategoryByCategoryId(id: number): Observable<Subcategory[]> {
    return this.http.get<Subcategory[]>(`/Subcategory/GetByCategoryId/{id}/${id}`);
  }

  getSubsubcategory(): Observable<Subsubcategory[]> {
    return this.http.get<Subsubcategory[]>('/Subsubcategory/Get');
  }

  getBySubsubcategoryBySubcategoryId(id: number): Observable<Subsubcategory[]> {
    return this.http.get<Subsubcategory[]>(`/Subsubcategory/GetBySubcategoryId/${id}`);
  }
}
