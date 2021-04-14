import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import data from './mock';
import iData from '../../models/direction-data.model';

@Injectable({
  providedIn: 'root'
})
export class HobbyService {

  constructor() { }

  //this method just immitates async request. All data comes from mock.ts
  getData(): Observable<iData[]> {
    return new Observable(subscriber => {
      setTimeout(() => {
        subscriber.next(data);
        subscriber.complete();
      }, 1000);
    });
  }
}
