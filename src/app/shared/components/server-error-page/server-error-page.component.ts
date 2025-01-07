import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { interval, Observable, take, takeWhile, tap } from 'rxjs';
import { TimerData } from 'shared/models/server-error';
import { ServerErrorService } from 'shared/services/server-error/server-error.service';
import { SetErrorTimerData } from 'shared/store/app.actions';
import { AppState } from 'shared/store/app.state';

@Component({
  selector: 'app-server-error-page',
  templateUrl: './server-error-page.component.html',
  styleUrls: ['./server-error-page.component.scss']
})
export class ServerErrorPageComponent implements OnInit {
  @Select(AppState.timerErrorTime)
  public timerTime$: Observable<TimerData>;

  public isDisabled!: boolean;
  public timerData!: TimerData; // static values from app state
  public disabledTime: number; // time of button disabling

  constructor(
    private readonly errorService: ServerErrorService,
    private readonly router: Router,
    private readonly store: Store
  ) {}

  public ngOnInit(): void {
    this.timerTime$.subscribe((res: TimerData) => {
      this.timerData = res;
    });
  }

  public checkServerAvailable(): void {
    this.isDisabled = true;
    this.disabledTime = this.timerData.timerValue / 1000;
    this.errorService
      .checkHealth()
      .pipe(take(1))
      .subscribe((result) => {
        const { status } = result;
        this.setTimerData();
        if (status === 'Healthy') {
          this.router.navigate(['/']);
        }
      });
  }

  /**
   * This method set data for disabled button timer
   */
  public setTimerData(): void {
    interval(1000)
      .pipe(
        takeWhile(() => this.disabledTime > 0),
        tap(() => this.disabledTime--)
      )
      .subscribe({
        complete: () => {
          this.store.dispatch(new SetErrorTimerData(this.timerData));
          this.isDisabled = false;
        }
      });
  }
}
