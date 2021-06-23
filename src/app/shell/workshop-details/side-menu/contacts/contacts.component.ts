import { Component, Input, OnInit } from '@angular/core';
import { Workshop } from 'src/app/shared/models/workshop.model';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  address:string = 'https://www.google.com/maps/place/';

  @Input() workshop: Workshop;

  constructor() { }

  ngOnInit(): void { }

}
