import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProgressBarService {
  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  constructor() { }
}
