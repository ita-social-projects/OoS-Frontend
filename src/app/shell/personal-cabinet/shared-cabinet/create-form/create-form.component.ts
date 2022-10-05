import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { FeaturesList } from '../../../../shared/models/featuresList.model';
import { NavigationBarService } from '../../../../shared/services/navigation-bar/navigation-bar.service';
import { MarkFormDirty } from '../../../../shared/store/app.actions';
import { AppState } from '../../../../shared/store/app.state';
import { MetaDataState } from '../../../../shared/store/meta-data.state';
import { DeleteNavPath } from '../../../../shared/store/navigation.actions';
import { SharedUserState } from '../../../../shared/store/shared-user.state';

@Component({
  selector: 'app-create-form',
  template: '',
})
export abstract class CreateFormComponent implements OnInit, OnDestroy {
  @Select(AppState.isDirtyForm)
  isDirtyForm$: Observable<boolean>;
  @Select(SharedUserState.isLoading)
  isLoading$: Observable<boolean>;
  @Select(MetaDataState.featuresList)
  featuresList$: Observable<FeaturesList>;
  isRelease3: boolean;
  destroy$: Subject<boolean> = new Subject<boolean>();

  isPristine = true;
  editMode: boolean;

  constructor(
    public store: Store,
    public route: ActivatedRoute,
    public navigationBarService: NavigationBarService) { }

  ngOnInit(): void { }

  abstract setEditMode(): void;
  abstract addNavPath(): void;

  determineRelease(): void {
    this.featuresList$
      .pipe(
        takeWhile(() => this.isPristine))
      .subscribe((featuresList: FeaturesList) => this.isRelease3 = featuresList.release3);
  }

  determineEditMode(): void {
    this.editMode = Boolean(this.route.snapshot.paramMap.get('param'));
    if (this.editMode) {
      this.setEditMode();
    }
  }

  public subscribeOnDirtyForm(form: FormGroup | FormArray): void {
    form.valueChanges
      .pipe(
        takeWhile(() => this.isPristine))
      .subscribe(() => {
        this.isPristine = false;
        this.store.dispatch(new MarkFormDirty(true));
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(new DeleteNavPath());
  }
}
