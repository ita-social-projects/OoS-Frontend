import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CategorySelect } from '../../models/category-select.model';

@Injectable({
  providedIn: 'root'
})

export class CategorySelectService {

  dataUrl = '/assets/mock-category-select.json';

  constructor(private http: HttpClient) { }

  getCategories(): Observable<CategorySelect[]> {
    return this.http.get<CategorySelect[]>(this.dataUrl)
      .pipe(map((data) => {
        return data;
      }));
  }
}
