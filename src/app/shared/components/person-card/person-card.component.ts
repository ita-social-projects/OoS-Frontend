import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-person-card',
  templateUrl: './person-card.component.html',
  styleUrls: ['./person-card.component.scss']
})
export class PersonCardComponent implements OnInit {
  @Input() card;
  @Input() isChildInfo: boolean;

  constructor() { }

  ngOnInit(): void { }
}
