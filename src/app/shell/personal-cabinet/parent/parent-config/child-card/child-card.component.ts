import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Child } from 'src/app/shared/models/child.model';

@Component({
  selector: 'app-child-card',
  templateUrl: './child-card.component.html',
  styleUrls: ['./child-card.component.scss']
})
export class ChildCardComponent implements OnInit {
  @Input () card: Child;
  
  constructor() { }

  ngOnInit(): void {
  }

}
