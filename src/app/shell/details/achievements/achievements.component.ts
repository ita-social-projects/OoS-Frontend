import { Component, Input, OnInit } from '@angular/core';
import { NoResultsTitle } from 'src/app/shared/enum/no-results';
import { Achievement } from 'src/app/shared/models/achievement.model';

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.scss'],
})
export class AchievementsComponent implements OnInit {
  readonly noResultAchievements = NoResultsTitle.noAchievements;

  @Input() achievements: Achievement[];

  constructor() {}

  ngOnInit(): void {}
}
