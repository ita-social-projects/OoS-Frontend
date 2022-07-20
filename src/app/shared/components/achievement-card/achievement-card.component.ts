import { Component, Input, OnInit } from '@angular/core';
import { Subject } from '@microsoft/signalr';
import { Store } from '@ngxs/store';
import { AchievementsTitle } from '../../constants/constants';
import { Achievement } from '../../models/achievement.model';
import { Workshop } from '../../models/workshop.model';
import { RegistrationState } from '../../store/registration.state';
import { Provider } from 'src/app/shared/models/provider.model';
import { ActivatedRoute } from '@angular/router';
import { Role } from '../../enum/role';

@Component({
  selector: 'app-achievement-card',
  templateUrl: './achievement-card.component.html',
  styleUrls: ['./achievement-card.component.scss'],
})
export class AchievementCardComponent implements OnInit {
  destroy$: Subject<boolean> = new Subject<boolean>();
  @Input() achievement: Achievement;
  @Input() workshop: Workshop;
  @Input() workshops;
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
    this.role = this.store.selectSnapshot<string>(RegistrationState.role);
  }

  getWorkshopIds(arr): string[] {
    const res = [];
    arr.forEach((i) => res.push(i.workshopId));
    return res;
  }
}
