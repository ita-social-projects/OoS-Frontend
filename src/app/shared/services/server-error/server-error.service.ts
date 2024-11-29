import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, timer } from 'rxjs';
import { TimerData, TimerFunctionReturn } from 'shared/models/server-error';

@Injectable({
  providedIn: 'root'
})
export class ServerErrorService {
  public storageData: TimerData = localStorage.getItem('try-again-timer')
    ? JSON.parse(localStorage.getItem('try-again-timer'))
    : { timerValue: 1000, time: 0 };
  private isButtonDisabledSubject = new BehaviorSubject<boolean>(false);
  public isButtonDisabled$ = this.isButtonDisabledSubject.asObservable();
  constructor(private readonly http: HttpClient) {}

  public serverIsAvailable(): TimerFunctionReturn {
    this.isButtonDisabledSubject.next(true);

    // check if 10 minutes have passed since the last click
    if (Date.now() - this.storageData.time >= 10 * 60 * 1000) {
      this.storageData = { timerValue: 1000, time: 0 };
      localStorage.setItem('try-again-timer', JSON.stringify(this.storageData));
    }
    timer(this.storageData.timerValue).subscribe(() => this.isButtonDisabledSubject.next(false));
    this.storageData =
      this.storageData.timerValue === 1000
        ? {
            timerValue: this.storageData.timerValue,
            time: Date.now()
          }
        : {
            timerValue: this.storageData.timerValue,
            time: this.storageData.time
          };
    const resultValue = {
      status: firstValueFrom(this.http.get<{ status: string }>('/healthz/active')),
      timerValue: this.storageData.timerValue
    };
    this.storageData.timerValue = this.storageData.timerValue / 1000 >= 32 ? 60 * 1000 : this.storageData.timerValue * 2;
    localStorage.setItem('try-again-timer', JSON.stringify(this.storageData));
    return resultValue;
  }
}
