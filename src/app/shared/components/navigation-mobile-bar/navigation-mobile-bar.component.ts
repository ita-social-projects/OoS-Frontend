import { Navigation } from './../../models/navigation.model';
import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { NavigationState } from '../../store/navigation.state';
import {Location} from '@angular/common';

@Component({
  selector: 'app-navigation-mobile-bar',
  templateUrl: './navigation-mobile-bar.component.html',
  styleUrls: ['./navigation-mobile-bar.component.scss']
})
export class NavigationMobileBarComponent {

  @Select(NavigationState.navigationPathsMobile)
  navigationPathsMobile$: Observable<Navigation[]>;
  @Select(NavigationState.navigationPaths)
  navigationPaths$: Observable<Navigation[]>;

  constructor(private location: Location) { }

  goBack(): void {
    this.location.back();
  }

}
