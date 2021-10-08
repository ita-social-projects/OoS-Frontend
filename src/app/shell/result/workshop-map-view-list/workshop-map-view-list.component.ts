import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Constants } from 'src/app/shared/constants/constants';
import { Address } from 'src/app/shared/models/address.model';
import { PaginationElement } from 'src/app/shared/models/paginationElement.model';
import { WorkshopCard, WorkshopFilterCard } from 'src/app/shared/models/workshop.model';
import { PageChange } from 'src/app/shared/store/filter.actions';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { Util } from 'src/app/shared/utils/utils';

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
export class WorkshopMapViewListComponent implements OnInit {

  constructor(private store: Store) { }

  @Input() public filteredWorkshops: WorkshopFilterCard;
  workshops: WorkshopCard[];
  public selectedWorkshops: WorkshopCard[] = [];
  public isSelectedMarker = false;
  public currentPage: PaginationElement = {
    element: 1,
    isActive: true
  };
  public workshopDetailsAnimationState = false;

  @Select(RegistrationState.parent)
  isParent$: Observable<boolean>;
  @ViewChild('WorkshopsWrap') workshopsWrap: ElementRef;
  widthOfWorkshopCard = Constants.WIDTH_OF_WORKSHOP_CARD;

  ngOnInit() {
    this.workshops = this.filteredWorkshops?.entities;
  
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

}
