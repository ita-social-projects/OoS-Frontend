import { Component, Input, OnInit } from '@angular/core';
import { Workshop } from 'src/app/shared/models/workshop.model';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {

  @Input() workshop: Workshop;
  map = 'https://www.google.com/maps/place/';

  constructor() { }

  ngOnInit(): void { }

}
