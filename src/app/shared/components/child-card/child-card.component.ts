import { Component, Input, OnInit } from '@angular/core';
import { Child } from '../../models/child.model';

@Component({
  selector: 'app-child-card',
  templateUrl: './child-card.component.html',
  styleUrls: ['./child-card.component.scss']
})
export class ChildCardComponent implements OnInit {

  @Input() child: Child;

  constructor() { }

  ngOnInit(): void {}
}
