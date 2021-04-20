import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { KeyWord } from '../../models/keyWord,model';
@Injectable({
  providedIn: 'root'
})

export class KeyWordsService {

  dataUrl = '/assets/mock-key-words.json';

  constructor(private http: HttpClient) { }

  getKeyWords(): Observable<KeyWord[]> {
    return this.http.get<KeyWord[]>(this.dataUrl)
      .pipe(map((data) => {
        return data;
      }))
  }
}
