import { Component, OnDestroy } from '@angular/core';
import { merge, of, Subject, throttleTime } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { ShowMessageBar } from 'shared/store/app.actions';
import { Store } from '@ngxs/store';
import { TranslateService } from '@ngx-translate/core';

@Component({
  template: ''
})
export abstract class FieldsListenerComponent implements OnDestroy {
  protected destroy$ = new Subject();
  protected abstract fieldsToListen: string[];

  protected constructor(
    protected readonly store: Store,
    protected readonly translateService: TranslateService
  ) {}

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  protected listenToChanges(form: FormGroup): void {
    const mappedFields = this.fieldsToListen.map(
      (controlName) =>
        form.get(controlName)?.valueChanges.pipe(
          throttleTime(5000, undefined, {
            leading: true,
            trailing: false
          })
        ) ?? of()
    );

    merge(...mappedFields)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.store.dispatch(
          new ShowMessageBar({
            message: this.translateService.instant('SERVICE_MESSAGES.SNACK_BAR_TEXT.CHANGE_REQUIRES_MODERATION'),
            type: 'warningYellow'
          })
        );
      });
  }
}
