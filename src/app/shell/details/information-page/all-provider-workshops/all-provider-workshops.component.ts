import { Component, Input, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { Role } from 'src/app/shared/enum/role';
import { Workshop, WorkshopCard } from 'src/app/shared/models/workshop.model';
import { UserState } from 'src/app/shared/store/user.state';

@Component({
  selector: 'app-all-provider-workshops',
  templateUrl: './all-provider-workshops.component.html',
  styleUrls: ['./all-provider-workshops.component.scss']
})
export class AllProviderWorkshopsComponent implements OnInit {

  readonly Role = Role;
  @Input() role: string;
  @Input() workshop: Workshop;

  @Select(UserState.workshops) workshops$: Observable<WorkshopCard[]>;
  workshops: WorkshopCard[];
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor() { }

  ngOnInit(): void {
    this.workshops$.pipe(
      filter((workshops: WorkshopCard[]) => !!workshops),
      takeUntil(this.destroy$)).subscribe((workshops: WorkshopCard[]) => {
        if (this.workshop) {
          this.workshops = workshops
            .filter((workshop: WorkshopCard) => workshop.workshopId !== this.workshop.id)
        } else {
          this.workshops = workshops;
        }

      })
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
