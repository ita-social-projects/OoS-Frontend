import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category, Subcategory, Subsubcategory } from '../../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  dataUrlCategories = '/assets/mock-categories-cards.json';
  dataUrl = '/Category/Get';

  constructor(private http: HttpClient) { }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.dataUrl);
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`/Category/GetById/${id}`);
  }

  getBySubcategoryByCategoryId(id: number): Observable<Subcategory[]> {
    return this.http.get<Subcategory[]>(`/Subcategory/GetByCategoryId/${id}`);
  }

  getBySubsubcategoryBySubcategoryId(id: number): Observable<Subsubcategory[]> {
    return this.http.get<Subsubcategory[]>(`/Subsubcategory/GetBySubcategoryId/${id}`);
  }

  getSubCategoryById(id: number): Observable<Subcategory> {
    return this.http.get<Subcategory>(`/Subcategory/GetById/${id}`);
  }

  getSubSubCategoryById(id: number): Observable<Subsubcategory> {
    return this.http.get<Subsubcategory>(`/Subsubcategory/GetById/${id}`);
  }
}
