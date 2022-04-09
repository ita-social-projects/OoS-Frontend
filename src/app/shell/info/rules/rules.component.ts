import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { AddNavPath, DeleteNavPath } from 'src/app/shared/store/navigation.actions';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit, OnDestroy {

  constructor(private store: Store, public navigationBarService: NavigationBarService) { }

  ngOnInit(): void {
    this.store.dispatch(
      new AddNavPath(this.navigationBarService.creatOneNavPath(
        { name: NavBarName.Rules, isActive: false, disable: true }
      )),
    );
  }

  ngOnDestroy(): void {
    this.store.dispatch(new DeleteNavPath());
  }

}
