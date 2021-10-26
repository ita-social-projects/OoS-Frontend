import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { Constants } from 'src/app/shared/constants/constants';
import { Role } from 'src/app/shared/enum/role';
import { Address } from 'src/app/shared/models/address.model';
import { PaginationElement } from 'src/app/shared/models/paginationElement.model';
import { WorkshopCard, WorkshopFilterCard } from 'src/app/shared/models/workshop.model';
import { PageChange } from 'src/app/shared/store/filter.actions';
import { RegistrationState } from 'src/app/shared/store/registration.state';

@Component({
  selector: 'app-workshop-map-view-list',
  templateUrl: './workshop-map-view-list.component.html',
  styleUrls: ['./workshop-map-view-list.component.scss'],
  animations: [
    trigger('fade', [
      transition('* => true', [
        style({ bottom: '-25px', opacity: 0 }),
        animate('200ms ease-in-out')
      ])
    ])
  ]
})
export class WorkshopMapViewListComponent implements OnInit, OnDestroy {

  constructor(private store: Store) { }
  destroy$: Subject<boolean> = new Subject<boolean>();
  @Input() public filteredWorkshops$: Observable<WorkshopFilterCard>;
  @Input() resetFilter$: Observable<void>;
  @Input() role: string;

  workshops: WorkshopCard[];
  public selectedWorkshops: WorkshopCard[] = [];
  public isSelectedMarker = false;
  readonly Role = Role;
  public currentPage: PaginationElement = {
    element: 1,
    isActive: true
  };
  public workshopDetailsAnimationState = false;


  @ViewChild('WorkshopsWrap') workshopsWrap: ElementRef;
  widthOfWorkshopCard = Constants.WIDTH_OF_WORKSHOP_CARD;

  ngOnInit(): void {
    this.filteredWorkshops$
      .pipe(takeUntil(this.destroy$), filter((filteredWorkshops) => !!filteredWorkshops))
      .subscribe(filteredWorkshops => this.workshops = filteredWorkshops.entities);

    this.resetFilter$
      .pipe(
        takeUntil(this.destroy$)
      ).subscribe(() => {
        this.currentPage = {
          element: 1,
          isActive: true
        }
        this.store.dispatch(new PageChange(this.currentPage))
      })

  }

  onSelectedAddress(address: Address): void {
    this.isSelectedMarker = Boolean(address);

    if (this.isSelectedMarker) {
      this.selectedWorkshops = this.workshops.filter((workshop: WorkshopCard) =>
        address.city === workshop.address.city &&
        address.street === workshop.address.street &&
        address.buildingNumber === workshop.address.buildingNumber);

      this.workshopDetailsAnimationState = true;
    }
    else {
      this.selectedWorkshops = [];
    }
  }

  public fadeAnimationDone(): void {
    this.workshopDetailsAnimationState = false;
  }

  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.store.dispatch(new PageChange(page));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
