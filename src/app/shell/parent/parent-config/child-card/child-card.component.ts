import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ChildCard } from 'src/app/shared/models/child-card.model';

@Component({
  selector: 'app-child-card',
  templateUrl: './child-card.component.html',
  styleUrls: ['./child-card.component.scss']
})
export class ChildCardComponent implements OnInit {
  @Input () card: ChildCard;
  
  constructor() { }

  ngOnInit(): void {
  }

}
