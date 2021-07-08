import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProgressBarService {
  public isLoading: Boolean = true

  constructor(isLoading) {
    this.isLoading=isLoading;
   }
}
