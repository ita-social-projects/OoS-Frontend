import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { Navigation } from 'shared/models/navigation.model';
import { NavigationState } from 'shared/store/navigation.state';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent {
  @Select(NavigationState.navigationPaths)
  public navigationPaths$: Observable<Navigation[]>;

  constructor() {}
}
