import { NavigationState } from 'shared/store/navigation.state';
import { Navigation } from 'shared/models/navigation.model';
import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import { Select } from '@ngxs/store';

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
