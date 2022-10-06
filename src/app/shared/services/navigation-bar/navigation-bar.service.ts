import { Injectable } from '@angular/core';
import { Navigation } from '../../models/navigation.model';
import { NavBarName } from '../../enum/navigation-bar';

@Injectable({
  providedIn: 'root'
})
export class NavigationBarService {

  /**
   * Method create one navigation path
   * This method using for creating array of objects with params
   * for (navigation-button) and dispatching to the navigation-state.
   * @param {name, path?, isActive, disable}:Nav
   * @returns array of Object for navigation :Nav[]
   *
   */
  createOneNavPath(navPath: Navigation): Navigation[] {
    return [
      { name: NavBarName.MainPage, path: '/', isActive: true, disable: false },
      navPath];
  }

  /**
   * Method create two navigation path
   * @param {name, path?, isActive, disable}:Nav
   * @returns array of two Objects for navigation :Nav[]
   *
   */
  createNavPaths(firstNavPath: Navigation, secondNavPath: Navigation, thirdNavPath?: Navigation): Navigation[] {
    if (thirdNavPath !== undefined) {
      return [
        { name: NavBarName.MainPage, path: '/', isActive: true, disable: false },
        firstNavPath,
        secondNavPath,
        thirdNavPath];
    }
    return [
      { name: NavBarName.MainPage, path: '/', isActive: true, disable: false },
      firstNavPath,
      secondNavPath];
  }

  constructor() { }
}
