import { Component, Input, OnInit } from '@angular/core';
import { orgCard } from '../../models/org-card.model';
import { Workshop } from '../../models/workshop.model';

@Component({
  selector: 'app-organization-card',
  templateUrl: './organization-card.component.html',
  styleUrls: ['./organization-card.component.scss']
})
export class OrganizationCardComponent implements OnInit {

  @Input() card: Workshop;

  constructor() { }

  ngOnInit(): void {
  }

}
