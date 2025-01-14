import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { catchError, Observable, scan, Subject, takeUntil, takeWhile, throwError, timeout, timer } from 'rxjs';
import { TimerData } from 'shared/models/server-error';
import { ServerErrorService } from 'shared/services/server-error/server-error.service';
import { SetErrorTimerData } from 'shared/store/app.actions';
import { AppState } from 'shared/store/app.state';

@Component({
  selector: 'app-server-error-page',
  templateUrl: './server-error-page.component.html',
  styleUrls: ['./server-error-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServerErrorPageComponent implements OnInit, OnDestroy {
  @Select(AppState.timerErrorTime)
  public timerTime$: Observable<TimerData>;

  public isDisabled!: boolean;
  public timerData!: TimerData; // timer values from app state
  public disabledTime: number; // time of button disabling

  private readonly HEALTHY_STATUS = 'Healthy';
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly errorService: ServerErrorService,
    private readonly router: Router,
    private readonly store: Store,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.timerTime$.pipe(takeUntil(this.destroy$)).subscribe((response: TimerData) => {
      this.timerData = response;
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public checkServerAvailable(): void {
    this.isDisabled = true;
    this.disabledTime = this.timerData.timerValue / 1000;
    this.errorService
      .checkHealth()
      .pipe(
        timeout(this.timerData.timerValue),
        catchError((error) => {
          this.isDisabled = false;
          return throwError(() => error);
        })
      )
      .subscribe((result: { status: string }) => {
        const { status } = result;
        this.setTimerData();
        if (status === this.HEALTHY_STATUS) {
          this.router.navigate(['/']);
        }
      });
  }

  /**
   * This method set data for disabled button timer
   */
  public setTimerData(): void {
    timer(0, 1000)
      .pipe(
        scan((timerTime) => {
          this.disabledTime = timerTime - 1;
          this.changeDetectorRef.markForCheck();
          return this.disabledTime;
        }, this.disabledTime),
        takeWhile((time) => time > 0)
      )
      .subscribe({
        complete: () => {
          this.store.dispatch(new SetErrorTimerData(this.timerData));
          this.isDisabled = false;
        }
      });
  }
}
