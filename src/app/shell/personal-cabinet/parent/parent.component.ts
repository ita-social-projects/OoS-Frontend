import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CabinetDataComponent } from '../shared-cabinet/cabinet-data.component';
import { filter, takeUntil } from 'rxjs/operators';
import { Parent } from '../../../shared/models/parent.model';
import { RegistrationState } from '../../../shared/store/registration.state';

@Component({
  selector: 'app-parent',
  template: '',
})
export abstract class ParentComponent extends CabinetDataComponent implements OnInit, OnDestroy {
  @Select(RegistrationState.parent)
  parent$: Observable<Parent>;
  parent: Parent;

  constructor(protected store: Store, protected matDialog: MatDialog) {
    super(store, matDialog);
  }

  abstract initParentData(): void;

  /**
   * This method subscribe on provider and get it's workshops
   */
  init(): void {
    this.parent$.pipe(filter(Boolean), takeUntil(this.destroy$)).subscribe((parent: Parent) => {
      this.parent = parent;
      this.initParentData();
    });
  }
}
