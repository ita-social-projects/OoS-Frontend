import { Select, Store } from '@ngxs/store';

import { AdminState } from 'src/app/shared/store/admin.state';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent {
  @Select(AdminState.isLoading)
  isLoading$: Observable<boolean>;

  constructor(private store: Store) { }

}
