import { Component } from '@angular/core';
import { RouterDataResolved } from '@ngxs/router-plugin';
import { Actions, ofActionSuccessful, Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SetBreadCrumb } from './shared/store/user.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'out-of-school';

  private destroy$ = new Subject<void>();
  
  constructor(public actions$: Actions, public store: Store) {
    actions$.pipe(
      ofActionSuccessful(RouterDataResolved),
      takeUntil(this.destroy$)
    ).subscribe(
      (action: RouterDataResolved) => {
        let crumb: string = action.routerState.root.firstChild.data.breadCrumb;
        console.log({ breadCrumb: crumb, urlLink: action.routerState.url })
        store.dispatch(new SetBreadCrumb({ breadCrumb: crumb, urlLink: action.routerState.url }))
      }
    )
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
