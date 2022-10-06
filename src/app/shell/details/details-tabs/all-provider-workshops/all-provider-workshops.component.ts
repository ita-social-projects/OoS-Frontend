import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { NoResultsTitle } from '../../../../shared/enum/no-results';
import { Role } from '../../../../shared/enum/role';
import { Workshop, WorkshopCard } from '../../../../shared/models/workshop.model';
import { SharedUserState } from '../../../../shared/store/shared-user.state';

@Component({
  selector: 'app-all-provider-workshops',
  templateUrl: './all-provider-workshops.component.html',
  styleUrls: ['./all-provider-workshops.component.scss']
})
export class AllProviderWorkshopsComponent implements OnInit, OnDestroy {
  readonly noResultWorkshops = NoResultsTitle.noResultWorkshops;
  readonly Role = Role;

  @Input() workshop: Workshop;

  @Select(SharedUserState.workshops)
    workshops$: Observable<WorkshopCard[]>;
  workshops: WorkshopCard[];
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor() { }

  ngOnInit(): void {
    this.workshops$.pipe(
      filter((workshops: WorkshopCard[]) => !!workshops),
      takeUntil(this.destroy$)).subscribe((workshops: WorkshopCard[]) => this.workshops = workshops);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
