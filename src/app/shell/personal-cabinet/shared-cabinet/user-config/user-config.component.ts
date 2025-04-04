import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { Constants } from 'shared/constants/constants';
import { Gender } from 'shared/enum/enumUA/gender';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { Role } from 'shared/enum/role';
import { User } from 'shared/models/user.model';
import { PopNavPath, PushNavPath } from 'shared/store/navigation.actions';
import { RegistrationState } from 'shared/store/registration.state';
import { MetaDataState } from 'shared/store/meta-data.state';
import { FeaturesList } from 'shared/models/features-list.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-user-config',
  templateUrl: './user-config.component.html',
  styleUrls: ['./user-config.component.scss']
})
export class UserConfigComponent implements OnInit, OnDestroy {
  @Select(RegistrationState.user)
  public user$: Observable<User>;
  @Select(RegistrationState.role)
  public role$: Observable<Role>;
  @Select(MetaDataState.featuresList)
  public featuresList$: Observable<FeaturesList>;

  public readonly gender = Gender;
  public readonly dateFormat = Constants.SHORT_DATE_FORMAT;
  public readonly role = Role;

  public authServer: string = environment.stsServer;
  public culture: string = localStorage.getItem('ui-culture');
  public link: string;
  public featuresList: FeaturesList;

  private readonly destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store) {}

  public ngOnInit(): void {
    this.store.dispatch(
      new PushNavPath({
        name: NavBarName.PersonalInformation,
        isActive: false,
        disable: true
      })
    );

    this.featuresList$.pipe(filter(Boolean), takeUntil(this.destroy$)).subscribe((featuresList: FeaturesList) => {
      this.featuresList = featuresList;
    });
  }

  public onRedirect(link: string): void {
    window.open(`${this.authServer + link}?culture=${this.culture}&ui-culture=${this.culture}`, link, 'height=500,width=500');
  }

  public ngOnDestroy(): void {
    this.store.dispatch(new PopNavPath());
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
