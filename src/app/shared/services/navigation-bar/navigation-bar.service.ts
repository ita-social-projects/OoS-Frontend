import { Injectable } from '@angular/core';
import { Nav } from '../../models/navigation.model';
import { NavBarName } from '../../enum/navigation-bar';

@Injectable({
  providedIn: 'root'
})
export class NavigationBarService {

 /**
    * This method create one Navigation button
    * @param {name, path?, isActive, disable}:Nav
    * 
    */
  creatOneNavPath(navPath: Nav): Nav[] {
    return [
      {name: NavBarName.MainPage, path:'/', isActive: true, disable: false},
      navPath];
  }

   /**
    * This method create two Navigation button
    * @param {name, path?, isActive, disable}:Nav
    * 
    */
  creatNavPaths(firstNavPath: Nav, secondNavPath: Nav): Nav[] {
    return [
      {name: NavBarName.MainPage, path:'/', isActive: true, disable: false},
      firstNavPath,
      secondNavPath];
  }

  constructor() { }
}
