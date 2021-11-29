import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { Constants } from 'src/app/shared/constants/constants';
import { Role } from 'src/app/shared/enum/role';
import { Address } from 'src/app/shared/models/address.model';
import { PaginationElement } from 'src/app/shared/models/paginationElement.model';
import { WorkshopCard, WorkshopFilterCard } from 'src/app/shared/models/workshop.model';
import { PageChange } from 'src/app/shared/store/filter.actions';

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
    ]),
    trigger('triggerName', [
      transition(':decrement', [animate('0.2s ease-in-out', style({ transform: "translateX(+92vw)" }))]),
      transition(':increment', [animate('0.2s ease-in-out', style({ transform: "translateX(-92vw)" }))]),
    ]),
  ]
})
export class WorkshopMapViewListComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();

  @Input() filteredWorkshops$: Observable<WorkshopFilterCard>;
  @Input() role: string;
  @Input()
  set currentPage(page) {
    this._currentPage = page
  };

  workshops: WorkshopCard[];
  selectedWorkshops: WorkshopCard[] = [];
  isSelectedMarker = false;
  readonly Role = Role;
  _currentPage: PaginationElement = {
    element: 1,
    isActive: true
  };
  workshopDetailsAnimationState = false;

  @ViewChild('CurSelectedWorkshop') curSelectedWorkshop: ElementRef;

  private swipeCoord?: [number, number];
  private swipeTime?: number;
  public currentWorkShopIndex: number = 0;
  public direct: string
  public left: number = 0

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.filteredWorkshops$
      .pipe(
        takeUntil(this.destroy$),
        filter((filteredWorkshops: WorkshopFilterCard) => !!filteredWorkshops)
      )
      .subscribe((filteredWorkshops: WorkshopFilterCard) => {
        this.workshops = filteredWorkshops.entities;
        this.onSelectedAddress(null);
      });
  }

  swipe(e: TouchEvent, when: string): void {
    const coord: [number, number] = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
    let time = new Date().getTime();

    if (when === 'start' && (time - this.swipeTime) < 300) {
      time -= 1000
    }

    if (when === 'start') {
      this.swipeCoord = coord;
      this.swipeTime = time;
    } else if (when === 'end') {
      const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
      const duration = time - this.swipeTime;
      if (duration < 1000 && Math.abs(direction[0]) > 30 && Math.abs(direction[0]) > Math.abs(direction[1] * 3)) {
        const swipe = direction[0] < 0 ? 'next' : 'previous';
        this.direct = swipe
        if (swipe === 'next') {
          (this.selectedWorkshops.length - 1) > this.currentWorkShopIndex && this.currentWorkShopIndex++
        } else {
          this.currentWorkShopIndex >= 1 && this.currentWorkShopIndex--
        }
      }
    }
  }

  triggerNameDone(e) {
    if (this.direct === 'next' && this.selectedWorkshops.length > 1) {
      this.left = parseInt(this.curSelectedWorkshop.nativeElement.style.left) - 92
    }
    if (this.direct === 'previous' && this.selectedWorkshops.length > 1) {
      this.left = parseInt(this.curSelectedWorkshop.nativeElement.style.left) + 92
    }
  }

  onSelectedAddress(address: Address): void {

    this.isSelectedMarker = Boolean(address);
    this.left = 0;
    this.currentWorkShopIndex = 0;
    this.direct = null

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
    this._currentPage = page;
    this.store.dispatch(new PageChange(page));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
