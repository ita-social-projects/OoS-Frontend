import { Component, Input, OnInit } from '@angular/core';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { Constants } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  readonly constants: typeof Constants = Constants;
  address = 'https://www.google.com/maps/place/';

  @Input() workshop: Workshop;

  constructor() { }

  ngOnInit(): void { }

  /*Detects device and opens map*/
  mapLink(): void {
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      this.address = 'http://maps.apple.com:';
      window.open(`${this.address} ${this.workshop.address.street},+ ${this.workshop.address.buildingNumber} ,+ ${this.workshop.address.city}`);
    } else if (/Android/i.test(navigator.userAgent)) {
      window.open(`${this.address} ${this.workshop.address.street},+ ${this.workshop.address.buildingNumber} ,+ ${this.workshop.address.city}`);
    } else {
      window.open(`${this.address} ${this.workshop.address.street},+ ${this.workshop.address.buildingNumber} ,+ ${this.workshop.address.city}`, '_blank');
    }
  }
}
