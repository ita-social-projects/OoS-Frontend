import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-achievement',
  templateUrl: './create-achievement.component.html',
  styleUrls: ['./create-achievement.component.scss'],
})
export class CreateAchievementComponent implements OnInit {
  children$ = [
    { lastName: 'Тетерукова', firstName: 'Дарина' },
    { lastName: 'Узумакі', firstName: 'Боруто' },
    { lastName: 'Малинка', firstName: 'Малина' },
  ];

  constructor() {}

  ngOnInit(): void {}
}
