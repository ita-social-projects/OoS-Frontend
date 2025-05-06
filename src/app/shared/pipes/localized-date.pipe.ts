import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'localizedDate'
})
export class LocalizedDatePipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  public transform(value: string | null | undefined): string | null {
    if (!value) {
      return null; // Повертаємо null, якщо вхідне значення відсутнє
    }

    // Розбиваємо рядок YYYY-MM-DD на частини
    const parts = value.split('-');
    if (parts.length !== 3 || parts.some((part) => isNaN(parseInt(part, 10)))) {
      console.error('LocalizedDatePipe: Invalid date string format received:', value);
      // Можна повернути оригінальне значення або null, залежно від вимог
      return value; // Або null
    }

    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10); // Місяць від 1 до 12
    const day = parseInt(parts[2], 10);

    // Створюємо об'єкт Date. Важливо: місяць у конструкторі Date 0-індексований (0 для січня)
    // Тому від номера місяця віднімаємо 1.
    const date = new Date(year, month - 1, day);

    // Перевіряємо, чи створений об'єкт Date є валідною датою
    if (isNaN(date.getTime())) {
      console.error('LocalizedDatePipe: Could not create valid date from string:', value);
      return value; // Або null
    }

    const dayOfMonth = date.getDate();
    const monthIndex = date.getMonth(); // Отримуємо 0-індексований номер місяця

    // Отримуємо локалізовані назви місяців
    const monthNames: string[] | string = this.translate.instant('MONTHS.NAMES');

    // Перевіряємо, що monthNames є масивом і індекс місяця знаходиться в межах масиву
    if (!Array.isArray(monthNames) || monthIndex < 0 || monthIndex >= monthNames.length) {
      console.error('LocalizedDatePipe: MONTHS.NAMES translation is not an array or month index is out of bounds.', {
        monthNames,
        monthIndex
      });
      // Якщо локалізовані назви місяців недоступні або некоректні, можна повернути дату у стандартному форматі
      return `${dayOfMonth}/${month}/${year}`; // Використовуємо оригінальний номер місяця (1-12)
    }

    const monthName = monthNames[monthIndex];

    // Повертаємо дату у форматі "День Назва_Місяця"
    return `${dayOfMonth} ${monthName}`;
  }
}
