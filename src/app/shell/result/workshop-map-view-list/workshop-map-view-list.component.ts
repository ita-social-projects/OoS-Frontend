import { Component, Input, OnInit } from '@angular/core';
import { Address } from 'src/app/shared/models/address.model';
import { Workshop } from 'src/app/shared/models/workshop.model';

@Component({
  selector: 'app-workshop-map-view-list',
  templateUrl: './workshop-map-view-list.component.html',
  styleUrls: ['./workshop-map-view-list.component.scss']
})
export class WorkshopMapViewListComponent implements OnInit {

  @Input() workshops: Workshop[];
  selectedWorkshops: Workshop[] = [];
  isSelectedMarker: boolean = false;
  currentPage: number = 1;

  constructor() { }

  ngOnInit(): void {
    this.selectedWorkshops = this.workshops;
  }

  onSelectedAddress(address: Address): void {
    this.isSelectedMarker = Boolean(address);

    (this.isSelectedMarker) ?
      this.selectedWorkshops = this.workshops.filter((workshop: Workshop) =>
        address.city === workshop.address.city &&
        address.street === workshop.address.street &&
        address.buildingNumber === workshop.address.buildingNumber) : this.selectedWorkshops = this.workshops;
  }

}
