import { Navigation } from '../../models/navigation.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { NavigationState } from '../../store/navigation.state';
import { Location } from '@angular/common';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-navigation-mobile-bar',
  templateUrl: './navigation-mobile-bar.component.html',
  styleUrls: ['./navigation-mobile-bar.component.scss']
})
export class NavigationMobileBarComponent implements OnInit, OnDestroy {

  @Select(NavigationState.navigationPathsMobile)
  navigationPathsMobile$: Observable<Navigation[]>;
  navigationPathsMobile: Navigation[] = [];

  private navigation: Subscription;

  constructor(private location: Location) { }

  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    this.navigation = this.navigationPathsMobile$
    .pipe(delay(0))
    .subscribe((navigation) => this.navigationPathsMobile = navigation)
  }
  
  ngOnDestroy(): void {
     this.navigation.unsubscribe(); 
  }
}
