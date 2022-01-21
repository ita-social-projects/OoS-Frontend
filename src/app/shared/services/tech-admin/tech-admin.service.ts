import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TechAdmin } from '../../models/techAdmin.model';

@Injectable({
  providedIn: 'root'
})
export class TechAdminService {

  constructor() { }

 /**
  * This method get TechAdmin by id
  * !!But we need to change this function to get actual data from backend
  */
  getProfile(): Observable<TechAdmin> {
    return Observable.create(observer => {
      setTimeout(() => {
        observer.next({id:"id45nhb", userId: 95});
      }, 1000);
    })
  }

}
