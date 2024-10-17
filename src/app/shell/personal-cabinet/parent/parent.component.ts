import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { CabinetDataComponent } from '../shared-cabinet/cabinet-data.component';
import { Parent } from '../../../shared/models/parent.model';
import { RegistrationState } from '../../../shared/store/registration.state';

@Component({
  selector: 'app-parent',
  template: ''
})
export abstract class ParentComponent extends CabinetDataComponent implements OnInit, OnDestroy {
  @Select(RegistrationState.parent)
  public parent$: Observable<Parent>;

  public parent: Parent;

  constructor(
    protected store: Store,
    protected matDialog: MatDialog
  ) {
    super(store, matDialog);
  }

  /**
   * This method subscribe on provider and get it's workshops
   */
  public init(): void {
    this.parent$.pipe(filter(Boolean), takeUntil(this.destroy$)).subscribe((parent: Parent) => {
      this.parent = parent;
      this.initParentData();
    });
  }

  public abstract initParentData(): void;
}
