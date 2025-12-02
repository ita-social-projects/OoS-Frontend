import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Role } from 'shared/enum/role';
import { GetFavoriteWorkshops } from 'shared/store/parent.actions';
import { RegistrationState } from 'shared/store/registration.state';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit, OnDestroy {
  @Select(RegistrationState.role)
  private role$: Observable<string>;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store) {}

  public ngOnInit(): void {
    this.role$
      .pipe(takeUntil(this.destroy$))
      .subscribe((role: string) => role === Role.parent && this.store.dispatch(new GetFavoriteWorkshops()));
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
