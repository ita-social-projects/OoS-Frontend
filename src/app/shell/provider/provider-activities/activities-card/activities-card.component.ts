import { Component, OnInit, Input } from '@angular/core';
import { orgCard } from '../../../../shared/models/org-card.model';

@Component({
  selector: 'app-activities-card',
  templateUrl: './activities-card.component.html',
  styleUrls: ['./activities-card.component.scss']
})
export class ActivitiesCardComponent implements OnInit {

  @Input () card: orgCard;

  constructor() { }

  ngOnInit(): void {
  }

}
