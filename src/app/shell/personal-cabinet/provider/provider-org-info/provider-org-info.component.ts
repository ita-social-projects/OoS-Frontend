import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { Provider } from 'src/app/shared/models/provider.model';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { ActivateEditMode } from 'src/app/shared/store/app.actions';

@Component({
  selector: 'app-provider-org-info',
  templateUrl: './provider-org-info.component.html',
  styleUrls: ['./provider-org-info.component.scss'],
})
export class ProviderOrgInfoComponent implements OnInit {
  @Select(RegistrationState.provider)
  provider$: Observable<Provider>;
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private store: Store) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {}

  ActivateEditMode(): void {
    this.store.dispatch(new ActivateEditMode(true));
  }
}
