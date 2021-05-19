import { Component, Input, OnInit } from '@angular/core';
import { Workshop } from 'src/app/shared/models/workshop.model';

const workshoopDetailsMock = {
  description: 'Бальні танці — різновид парних танців, упорядкованих та кодифікованих для спортивних змагань.',
  programm: 'Інформація про програму має бути тут',
  groupe: 'Молодша група (7-10 років)',
  schedule: 'Пн, Ср 12-14 год Вт, Чт 18-20 год',
  duration: '2 години',
}

@Component({
  selector: 'app-workshop-about',
  templateUrl: './workshop-about.component.html',
  styleUrls: ['./workshop-about.component.scss']
})

export class WorkshopAboutComponent implements OnInit {

  @Input() workshop: Workshop;
  details;

  constructor() { }

  ngOnInit(): void {
    this.details = workshoopDetailsMock;
  }

}
