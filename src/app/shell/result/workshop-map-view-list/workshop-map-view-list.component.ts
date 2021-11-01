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
    ]),
    trigger('triggerName', [
      transition(':decrement', [animate('0.5s',style({ transform: "translateX(+92vw)"}))]),
      transition(':increment', [animate('0.5s',style({ transform: "translateX(-92vw)" }) )]),
    ]),
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
  @ViewChild('CurSelectedWorkshop') curSelectedWorkshop: ElementRef;
  widthOfWorkshopCard = Constants.WIDTH_OF_WORKSHOP_CARD;


  private swipeCoord?: [number, number];
  private swipeTime?: number;
  public currentWorkShopIndex: number = 0;
  public selectedWorkshopsLength = this.selectedWorkshops.length;
  public direct: string
  public left: number = 0
  swipe(e: TouchEvent, when: string): void {


    const coord: [number, number] = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
    const time = new Date().getTime();
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
          (this.selectedWorkshops.length-1) > this.currentWorkShopIndex && this.currentWorkShopIndex++
        } else {
          this.currentWorkShopIndex >= 1 && this.currentWorkShopIndex--
        }
    }
    }
  }

  triggerNameDone(e) {
    if (this.direct === 'next' && this.selectedWorkshops.length > 1 ) {
      this.left =parseInt(this.curSelectedWorkshop.nativeElement.style.left) - 92
    }
    if (this.direct === 'previous' && this.selectedWorkshops.length > 1) {
      this.left =parseInt(this.curSelectedWorkshop.nativeElement.style.left) + 92
    }
  }


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

    this.selectedWorkshopsLength = this.selectedWorkshops.length;
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
