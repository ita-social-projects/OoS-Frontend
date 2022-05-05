import { Component, OnInit } from '@angular/core';
import { Actions, Store } from '@ngxs/store';

@Component({
  selector: 'app-provider-list',
  templateUrl: './provider-list.component.html',
  styleUrls: ['./provider-list.component.scss'],
})
export class ProviderListComponent implements OnInit {
  constructor(store: Store, private actions$: Actions) {}

  ngOnInit(): void {}

  init(): void {
  }
}
