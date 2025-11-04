import { Component, EventEmitter, OnDestroy } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, pairwise, Subject } from 'rxjs';
import { distinctUntilChanged, filter, take, takeUntil, takeWhile } from 'rxjs/operators';

import { ModeConstants } from 'shared/constants/constants';
import { FeaturesList } from 'shared/models/features-list.model';
import { NavigationBarService } from 'shared/services/navigation-bar/navigation-bar.service';
import { MarkFormDirty } from 'shared/store/app.actions';
import { AppState } from 'shared/store/app.state';
import { MetaDataState } from 'shared/store/meta-data.state';
import { DeleteNavPath } from 'shared/store/navigation.actions';
import { SharedUserState } from 'shared/store/shared-user.state';
import { addBeforeUnloadProtection, Util } from 'shared/utils/utils';

@Component({
  selector: 'app-create-form',
  template: ''
})
export abstract class CreateFormComponent implements OnDestroy {
  @Select(AppState.isDirtyForm)
  public isDirtyForm$: Observable<boolean>;
  @Select(SharedUserState.isLoading)
  public isLoading$: Observable<boolean>;
  @Select(MetaDataState.featuresList)
  public featuresList$: Observable<FeaturesList>;

  public destroy$: Subject<boolean> = new Subject<boolean>();
  public isImagesFeature: boolean;
  public isPristine = true;
  public editMode: boolean;
  private removeUnloadProtection: () => void;

  protected constructor(
    protected store: Store,
    protected route: ActivatedRoute,
    protected navigationBarService: NavigationBarService
  ) {}

  public loadUnfinishedWorkshopData?(): void;

  public ngOnDestroy(): void {
    this.removeUnloadProtection?.();
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(new DeleteNavPath());
  }

  protected determineRelease(): void {
    this.featuresList$
      .pipe(
        filter(Boolean),
        takeWhile(() => this.isPristine)
      )
      .subscribe((featuresList: FeaturesList) => (this.isImagesFeature = featuresList.images));
  }

  protected determineEditMode(): void {
    const paramValue = this.route.snapshot.paramMap.get('param');

    if (paramValue === ModeConstants.UNFINISHED) {
      this.setEditMode();
    } else {
      this.editMode = Boolean(paramValue !== ModeConstants.NEW);
      if (this.editMode) {
        this.setEditMode();
      }
    }
  }

  protected subscribeOnDirtyForm(form: FormGroup | FormArray): void {
    form.valueChanges
      .pipe(
        distinctUntilChanged((prev, curr) => Util.deepEqual(prev, curr)),
        takeWhile(() => this.isPristine),
        pairwise()
      )
      .subscribe(([prev, curr]) => {
        console.log(prev);
        console.log(curr);
        this.isPristine = false;
        this.store.dispatch(new MarkFormDirty(true));
        this.isDirtyForm$.pipe(filter(Boolean), take(1), takeUntil(this.destroy$)).subscribe(() => {
          this.removeUnloadProtection = addBeforeUnloadProtection(() => true);
        });
      });
    this.subscribeOnTouchEvent(form);
  }

  /** This method add status change emit of touch event.
   * Validation hint captures touch event and displays validation error.
   * @param form FormGroup | FormArray
   */
  // TODO: rewrite/delete after migration to Angular 18, so this becomes useless
  protected subscribeOnTouchEvent(form: AbstractControl | FormControl | FormGroup | FormArray): void {
    const originalMethod = form.markAsTouched;
    form.markAsTouched = function (): void {
      originalMethod.apply(this, arguments);
      (form.statusChanges as EventEmitter<any>).emit();
    };

    if (form instanceof FormGroup) {
      Object.keys(form.controls).forEach((key: string) => {
        const control = form.get(key);
        this.subscribeOnTouchEvent(control);
      });
    }

    if (form instanceof FormArray) {
      form.controls.forEach((control: FormGroup) => {
        this.subscribeOnTouchEvent(control);
      });
    }
  }

  public abstract setEditMode(): void;

  public abstract addNavPath(): void;

  public abstract onSubmit(): void;

  public abstract onCancel(): void;
}
