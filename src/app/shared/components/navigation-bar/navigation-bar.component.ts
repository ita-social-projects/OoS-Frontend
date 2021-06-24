import { NavigationState } from './../../store/navigation.state';
import { Nav } from './../../models/navigation.model';
import { Observable } from 'rxjs';
import { Component} from '@angular/core';
import { Select, Store } from '@ngxs/store';


@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent {

  @Select(NavigationState.getNavPath)
  navigation$: Observable<Nav[]>

  constructor(private store: Store) { }
}


