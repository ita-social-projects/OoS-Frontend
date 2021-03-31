import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesIconsService {

  dataUrl = '/assets/categories-icons.json';

  constructor(private http: HttpClient) { }

  getIcons(): Observable<any> {
    return this.http.get(this.dataUrl);
  }
}
