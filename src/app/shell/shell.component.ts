import { Observable, Subject } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RegistrationState } from '../shared/store/registration.state';
import { takeUntil } from 'rxjs/operators';
import { Role } from '../shared/enum/role';
import { GetFavoriteWorkshops, GetFavoriteWorkshopsByUserId } from '../shared/store/parent.actions';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit, OnDestroy {
  @Select(RegistrationState.role)
    role$: Observable<string>;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.role$.pipe(takeUntil(this.destroy$)).subscribe((role: string) => {
      role == Role.parent && this.store.dispatch([new GetFavoriteWorkshops(), new GetFavoriteWorkshopsByUserId()]);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
