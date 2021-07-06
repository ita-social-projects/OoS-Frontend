import { Navigation } from './../../models/navigation.model';
import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { NavigationState } from '../../store/navigation.state';

@Component({
  selector: 'app-navigation-mobile-bar',
  templateUrl: './navigation-mobile-bar.component.html',
  styleUrls: ['./navigation-mobile-bar.component.scss']
})
export class NavigationMobileBarComponent implements OnInit {

  @Select(NavigationState.navigationPathsMobile)
  navigationPathsMobile$: Observable<Navigation[]>

  constructor() { }

  ngOnInit(): void {
  }

}
