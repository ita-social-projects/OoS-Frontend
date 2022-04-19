import { Component, Input } from '@angular/core';
import { WorkingDaysValues } from 'src/app/shared/constants/constants';
import { WorkingDaysToggleValue } from 'src/app/shared/models/workingHours.model';
import { Workshop } from 'src/app/shared/models/workshop.model';

@Component({
  selector: 'app-workshop-about',
  templateUrl: './workshop-about.component.html',
  styleUrls: ['./workshop-about.component.scss']
})

export class WorkshopAboutComponent {
  @Input() workshop: Workshop;
  days: WorkingDaysToggleValue[] = WorkingDaysValues.map((value: WorkingDaysToggleValue) => Object.assign({}, value));

  workshopDetailsMock = {
    description: 'Бальні танці — різновид парних танців, упорядкованих та кодифікованих для спортивних змагань.',
    programm: 'Інформація про програму має бути тут',
    groupe: 'Молодша група (7-10 років)',
    schedule: 'Пн, Ср 12-14 год Вт, Чт 18-20 год',
    duration: '2 години',
  };
}
