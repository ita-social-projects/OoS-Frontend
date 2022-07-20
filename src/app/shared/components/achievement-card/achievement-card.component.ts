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
  @Input() achievement: Achievement;
  @Input() workshop: Workshop;
  @Input() isAllowedEdit: boolean;
  readonly achievementsTitle = AchievementsTitle;
  showMore = false;
  
  constructor() {}

  ngOnInit(): void {}

}
