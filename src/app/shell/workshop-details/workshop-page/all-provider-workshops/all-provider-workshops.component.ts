import { Component, Input, OnInit } from '@angular/core';
import { Workshop } from 'src/app/shared/models/workshop.model';

@Component({
  selector: 'app-all-provider-workshops',
  templateUrl: './all-provider-workshops.component.html',
  styleUrls: ['./all-provider-workshops.component.scss']
})
export class AllProviderWorkshopsComponent implements OnInit {

  @Input() providerWorkshops: Workshop[];

  constructor() { }

  ngOnInit(): void {
  }

}
