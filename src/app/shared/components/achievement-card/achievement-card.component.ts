import { Component, Input, OnInit } from '@angular/core';
import { Achievement } from '../../models/achievement.model';

@Component({
  selector: 'app-achievement-card',
  templateUrl: './achievement-card.component.html',
  styleUrls: ['./achievement-card.component.scss']
})
export class AchievementCardComponent implements OnInit {
  @Input() achievement: Achievement;

  constructor() { }

  ngOnInit(): void {
  }

}
