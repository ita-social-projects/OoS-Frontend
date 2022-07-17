import { Component, Input, OnInit } from '@angular/core';
import { Subject } from '@microsoft/signalr';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AchievementsTitle } from '../../constants/constants';
import { Achievement } from '../../models/achievement.model';
import { Workshop } from '../../models/workshop.model';
import { RegistrationState } from '../../store/registration.state';
import { GetWorkshopsByProviderId } from '../../store/user.actions';
import { UserState } from '../../store/user.state';
import { Provider } from 'src/app/shared/models/provider.model';
import { ActivatedRoute } from '@angular/router';
import { Role } from '../../enum/role';

@Component({
  selector: 'app-achievement-card',
  templateUrl: './achievement-card.component.html',
  styleUrls: ['./achievement-card.component.scss'],
})
export class AchievementCardComponent implements OnInit {
  @Select(UserState.workshops) workshops: Observable<Workshop[]>;
  destroy$: Subject<boolean> = new Subject<boolean>();
  @Input() achievement: Achievement;
  @Input() workshop: Workshop;
  readonly achievementsTitle = AchievementsTitle;
  showMore = false;
  auth: boolean;
  provider: Provider;
  workshopId: string;
  role: string;
  readonly Role: Role;

  constructor(private store: Store, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.workshopId = this.route.snapshot.paramMap.get('id');
    this.provider = this.store.selectSnapshot<Provider>(
      RegistrationState.provider
    );
    this.auth = this.store.selectSnapshot<boolean>(
      RegistrationState.isAuthorized
    );
    this.store.dispatch(new GetWorkshopsByProviderId(this.provider?.id));
    this.role = this.store.selectSnapshot<string>(RegistrationState.role);
  }

  getWorkshopIds(arr): string[] {
    const res = [];
    arr.forEach((i) => res.push(i.workshopId));
    return res;
  }
}
