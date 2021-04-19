import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Application } from '../../../shared/models/application.model';
import { GetApplications } from '../../../shared/store/provider.actions';
import { ProviderState } from '../../../shared/store/provider.state';

@Component({
  selector: 'app-provider-requests',
  templateUrl: './provider-applications.component.html',
  styleUrls: ['./provider-applications.component.scss']
})
export class ProviderApplicationsComponent implements OnInit {

  @Select(ProviderState.applicationsList)
  cards$: Observable<Application[]>;
  public cards: Application[];

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new GetApplications())
    this.cards$.subscribe(cards =>
      this.cards = cards
    );
  }
  onApprove(event: Application): void {
    const card = this.cards.find((card) => (card === event))
    card.status = 'approved';
  }
  onDeny(event: Application): void {
    const card = this.cards.find((card) => (card === event))
    card.status = 'denied';

  }
}
