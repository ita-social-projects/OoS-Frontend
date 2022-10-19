import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Role } from '../../shared/enum/role';
import { RegistrationState } from '../../shared/store/registration.state';
@Component({
  selector: 'app-admin-tools',
  templateUrl: './admin-tools.component.html',
  styleUrls: ['./admin-tools.component.scss']
})
export class AdminToolsComponent implements OnInit, OnDestroy {
  readonly Role = Role;
  
  @Select(RegistrationState.role)
  role$: Observable<string>;
  role: Role;

  destroy$: Subject<boolean> = new Subject<boolean>();
  
  constructor() { }

  ngOnInit(): void {
    this.role$
      .pipe(takeUntil(this.destroy$))
      .subscribe((role: Role) => (this.role = role));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}