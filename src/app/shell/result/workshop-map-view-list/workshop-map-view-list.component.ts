import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { PaginationConstants } from 'shared/constants/constants';
import { Role } from 'shared/enum/role';
import { Address } from 'shared/models/address.model';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { PaginationParameters } from 'shared/models/query-parameters.model';
import { SearchResponse } from 'shared/models/search.model';
import { WorkshopCard } from 'shared/models/workshop.model';
import { ClearMessageBar } from 'shared/store/app.actions';
import { ClearCoordsByMap, ClearRadiusSize } from 'shared/store/filter.actions';
import { Util } from 'shared/utils/utils';

@Component({
  selector: 'app-workshop-map-view-list',
  templateUrl: './workshop-map-view-list.component.html',
  styleUrls: ['./workshop-map-view-list.component.scss'],
  animations: [
    trigger('fade', [transition('* => true', [style({ bottom: '-25px', opacity: 0 }), animate('200ms ease-in-out')])]),
    trigger('triggerName', [
      transition(':decrement', [animate('0.2s ease-in-out', style({ transform: 'translateX(+92vw)' }))]),
      transition(':increment', [animate('0.2s ease-in-out', style({ transform: 'translateX(-92vw)' }))])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkshopMapViewListComponent implements OnInit, OnDestroy {
  @ViewChild('CurSelectedWorkshop')
  public curSelectedWorkshop: ElementRef;

  @Input() public filteredWorkshops$: Observable<SearchResponse<WorkshopCard[]>>;
  @Input() public paginationParameters: PaginationParameters;
  @Input() public role: string;
  @Input() public currentPage: PaginationElement;

  public readonly Role = Role;

  public workshops: WorkshopCard[];
  public selectedWorkshops: WorkshopCard[] = [];
  public workshopsOnPage: WorkshopCard[] = [];
  public isSelectedMarker = false;
  public workshopDetailsAnimationState = false;

  public currentWorkShopIndex = 0;
  public direct: string;
  public left = 0;

  private destroy$: Subject<boolean> = new Subject<boolean>();
  private swipeCoord?: [number, number];
  private swipeTime?: number;

  constructor(private store: Store) {}

  public ngOnInit(): void {
    this.filteredWorkshops$
      .pipe(
        takeUntil(this.destroy$),
        filter((filteredWorkshops: SearchResponse<WorkshopCard[]>) => !!filteredWorkshops)
      )
      .subscribe((filteredWorkshops: SearchResponse<WorkshopCard[]>) => {
        this.workshops = filteredWorkshops.entities;
        this.onSelectedAddress(null);
      });
  }

  public swipe(e: TouchEvent, when: string): void {
    const coord: [number, number] = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
    let time = new Date().getTime();

    if (when === 'start' && time - this.swipeTime < 300) {
      time -= 1000;
    }

    if (when === 'start') {
      this.swipeCoord = coord;
      this.swipeTime = time;
    } else if (when === 'end') {
      const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
      const duration = time - this.swipeTime;
      if (duration < 1000 && Math.abs(direction[0]) > 30 && Math.abs(direction[0]) > Math.abs(direction[1] * 3)) {
        const swipe = direction[0] < 0 ? 'next' : 'previous';
        this.direct = swipe;
        if (swipe === 'next') {
          this.selectedWorkshops.length - 1 > this.currentWorkShopIndex && this.currentWorkShopIndex++;
        } else {
          this.currentWorkShopIndex >= 1 && this.currentWorkShopIndex--;
        }
      }
    }
  }

  public triggerNameDone(e: AnimationEvent): void {
    if (this.direct === 'next' && this.selectedWorkshops.length > 1) {
      this.left = parseInt(this.curSelectedWorkshop.nativeElement.style.left, 10) - 92;
    }
    if (this.direct === 'previous' && this.selectedWorkshops.length > 1) {
      this.left = parseInt(this.curSelectedWorkshop.nativeElement.style.left, 10) + 92;
    }
  }

  public onSelectedAddress(address: Address): void {
    this.isSelectedMarker = Boolean(address);
    this.left = 0;
    this.currentWorkShopIndex = 0;
    this.direct = null;

    if (this.isSelectedMarker) {
      this.selectedWorkshops = this.workshops.filter(
        (workshop: WorkshopCard) => address.latitude === workshop.address.latitude && address.longitude === workshop.address.longitude
      );
      this.workshopsOnPage = this.selectedWorkshops.slice(
        this.paginationParameters.from,
        this.paginationParameters.size + this.paginationParameters.from
      );
      this.workshopDetailsAnimationState = true;
    } else {
      this.selectedWorkshops = [];
    }
  }

  public fadeAnimationDone(): void {
    this.workshopDetailsAnimationState = false;
  }

  public onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.getWorkshopsOnPage();
  }

  public onItemsPerPageChange(itemsPerPage: number): void {
    this.paginationParameters.size = itemsPerPage;
    this.onPageChange(PaginationConstants.firstPage);
  }

  public ngOnDestroy(): void {
    this.store.dispatch([new ClearCoordsByMap(), new ClearRadiusSize(), new ClearMessageBar()]);
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private getWorkshopsOnPage(): void {
    Util.setFromPaginationParam(this.paginationParameters, this.currentPage, this.selectedWorkshops.length);
    this.workshopsOnPage = this.selectedWorkshops.slice(
      this.paginationParameters.from,
      this.paginationParameters.size + this.paginationParameters.from
    );
  }
}
