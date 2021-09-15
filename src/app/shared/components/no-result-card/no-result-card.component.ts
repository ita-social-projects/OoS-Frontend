import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-result-card',
  templateUrl: './no-result-card.component.html',
  styleUrls: ['./no-result-card.component.scss']
})
export class NoResultCardComponent implements OnInit {

  @Input() title: string;

  constructor() { }

  ngOnInit(): void {
  }

}
