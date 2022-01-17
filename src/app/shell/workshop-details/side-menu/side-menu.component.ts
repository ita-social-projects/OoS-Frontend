import { Workshop } from 'src/app/shared/models/workshop.model';
import { Component, Input, OnInit } from '@angular/core';
import { Role } from 'src/app/shared/enum/role';
import { Select } from '@ngxs/store';
import { AppState } from 'src/app/shared/store/app.state';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {

  @Select(AppState.isMobileScreen) isMobileScreen$: Observable<boolean>;
  isMobileScreen:boolean;

  readonly Role: typeof Role = Role;
  @Input() role: string;
  @Input() workshop: Workshop;

  destroy$: Subject<boolean> = new Subject<boolean>();


  constructor() { }

  ngOnInit(): void {
    this.isMobileScreen$.pipe(
      takeUntil(this.destroy$)
      ).subscribe((boolean) => this.isMobileScreen = boolean)
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
