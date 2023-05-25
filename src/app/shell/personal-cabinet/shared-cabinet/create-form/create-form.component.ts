import { Observable, Subject } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';

import { ModeConstants } from '../../../../shared/constants/constants';
import { FeaturesList } from '../../../../shared/models/featuresList.model';
import {
  NavigationBarService
} from '../../../../shared/services/navigation-bar/navigation-bar.service';
import { MarkFormDirty } from '../../../../shared/store/app.actions';
import { AppState } from '../../../../shared/store/app.state';
import { MetaDataState } from '../../../../shared/store/meta-data.state';
import { DeleteNavPath } from '../../../../shared/store/navigation.actions';
import { SharedUserState } from '../../../../shared/store/shared-user.state';

@Component({
  selector: 'app-create-form',
  template: ''
})
export abstract class CreateFormComponent implements OnInit, OnDestroy {
  @Select(AppState.isDirtyForm)
  isDirtyForm$: Observable<boolean>;
  @Select(SharedUserState.isLoading)
  isLoading$: Observable<boolean>;
  @Select(MetaDataState.featuresList)
  featuresList$: Observable<FeaturesList>;
  isImagesFeature: boolean;
  destroy$: Subject<boolean> = new Subject<boolean>();

  isPristine = true;
  editMode: boolean;

  constructor(protected store: Store, protected route: ActivatedRoute, protected navigationBarService: NavigationBarService) {}

  ngOnInit(): void {}

  abstract setEditMode(): void;
  abstract addNavPath(): void;

  protected determineRelease(): void {
    this.featuresList$
      .pipe(takeWhile(() => this.isPristine))
      .subscribe((featuresList: FeaturesList) => (this.isImagesFeature = featuresList.images));
  }

  protected determineEditMode(): void {
    this.editMode = Boolean(this.route.snapshot.paramMap.get('param') !== ModeConstants.NEW);
    if (this.editMode) {
      this.setEditMode();
    }
  }

  protected subscribeOnDirtyForm(form: FormGroup | FormArray): void {
    form.valueChanges.pipe(takeWhile(() => this.isPristine)).subscribe(() => {
      this.isPristine = false;
      this.store.dispatch(new MarkFormDirty(true));
    });
    this.subscribeOnTouchEvent(form);
  }

  /** This method add status change emit of touch event.
   * Validation hint captures touch event and displays validation error.
   * @param form: FormGroup | FormArray
   */
  protected subscribeOnTouchEvent(form: FormGroup | FormArray): void {
    let originalMethod = form.markAsTouched;

    Object.keys(form.controls).forEach((key: string) => {
      const control = form.get(key);
      control.markAsTouched = function () {
        originalMethod.apply(this, arguments);
        (control.statusChanges as EventEmitter<any>).emit();
      };
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(new DeleteNavPath());
  }
}
