import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
export interface keyWord{
  id:number;
  keyWord:string;
}
@Injectable({
  providedIn: 'root'
})

export class KeyWordsService {

  dataUrl = '/assets/mock-key-words.json';

  constructor(private http: HttpClient) { }

  getKeyWords(): Observable<keyWord[]>{
    return this.http.get<any>(this.dataUrl)
      .pipe(map((data)=>{
        return data;
      }))
  }

}
