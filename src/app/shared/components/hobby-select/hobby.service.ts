import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import data from './mock';
import iData from '../../models/direction-data.model';

@Injectable({
  providedIn: 'root'
})
export class HobbyService {

  constructor() { }

  getData(): Observable<iData[]> {
    return new Observable(subscriber => {
      setTimeout(() => {
        subscriber.next(data);
        subscriber.complete();
      }, 1000);
    });
  }
}
