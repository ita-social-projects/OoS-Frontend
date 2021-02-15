import { Component, Input, OnInit } from '@angular/core';
import { orgCard } from 'src/app/mock-org-cards';

@Component({
  selector: 'app-organization-card',
  templateUrl: './organization-card.component.html',
  styleUrls: ['./organization-card.component.scss']
})
export class OrganizationCardComponent implements OnInit {
  
  @Input () card: orgCard;

  constructor() { }

  ngOnInit(): void {
  }

}
