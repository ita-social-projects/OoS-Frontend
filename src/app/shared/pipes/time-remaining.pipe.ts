import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DeclinationPipe } from './declination.pipe';

@Pipe({
  name: 'timeRemaining',
  pure: false
})
export class TimeRemainingPipe implements PipeTransform {
  private readonly declinationPipe = new DeclinationPipe();
  private readonly timeForms = {
    ua: {
      days: ['день', 'дні', 'днів'],
      hours: ['година', 'години', 'годин'],
      minutes: ['хвилина', 'хвилини', 'хвилин'],
      remainingText: 'Залишилось',
      lessThanMinute: 'Залишилось менше хвилини'
    },
    en: {
      days: ['day', 'days', 'days'],
      hours: ['hour', 'hours', 'hours'],
      minutes: ['minute', 'minutes', 'minutes'],
      remainingText: 'Remaining',
      lessThanMinute: 'Less than a minute remaining'
    }
  };

  constructor(private translateService: TranslateService) {}

  public transform(value: string): string {
    if (!value) {
      return '';
    }

    const [days, hours, minutes] = value.split(':').map((num) => Math.floor(Number(num)));
    const currentLang = this.translateService.currentLang;
    const lang = currentLang && ['ua', 'en'].includes(currentLang) ? currentLang : 'ua';
    const timeForms = lang === 'ua' ? this.timeForms.ua : this.timeForms.en;

    if (days > 0) {
      return `${timeForms.remainingText} ${this.declinationPipe.transform(days, timeForms.days)}`;
    }

    const totalHours = hours + days * 24;
    if (totalHours > 0) {
      return `${timeForms.remainingText} ${this.declinationPipe.transform(totalHours, timeForms.hours)}`;
    }

    if (minutes > 0) {
      return `${timeForms.remainingText} ${this.declinationPipe.transform(minutes, timeForms.minutes)}`;
    }

    return timeForms.lessThanMinute;
  }
}
