import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { FeaturesList } from 'src/app/shared/models/featuresList.model';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { MarkFormDirty } from 'src/app/shared/store/app.actions';
import { AppState } from 'src/app/shared/store/app.state';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';
import { DeleteNavPath } from 'src/app/shared/store/navigation.actions';
import { UserState } from 'src/app/shared/store/user.state';

@Component({
  selector: 'app-create-form',
  template: '',
})
export abstract class CreateFormComponent implements OnInit, OnDestroy {
  @Select(AppState.isDirtyForm)
  isDirtyForm$: Observable<boolean>;
  @Select(UserState.isLoading)
  isLoading$: Observable<boolean>;
  @Select(MetaDataState.featuresList)
  featuresList$: Observable<FeaturesList>;
  isRelease2: boolean;
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
      .subscribe((featuresList: FeaturesList) => this.isRelease2 = featuresList.release2);
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
