import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Application } from 'src/app/shared/models/application.model';
import { GetApplications } from 'src/app/shared/store/provider.actions';
import { ProviderState } from 'src/app/shared/store/provider.state';


@Component({
  selector: 'app-requests',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit {

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
