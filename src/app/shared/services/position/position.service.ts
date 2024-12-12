import { Injectable } from '@angular/core';
import { PositionParameters } from 'shared/models/position.model';

@Injectable({
  providedIn: 'root'
})
export class PositionService {
  private readonly localStorageKey = 'positions_';

  public getPositions(parameters: PositionParameters): any[] {
    const localData = localStorage.getItem(this.localStorageKey + parameters.providerId);
    if (localData) {
      return JSON.parse(localData);
    }

    const mockData = [
      {
        id: '1',
        languages: ['Українська', 'Англійська'],
        description: 'Вчитель року',
        contactInformation: ['+380987654321'],
        shortName: 'Вчитель',
        fullName: 'Вчитель англійської',
        numOfSeats: 3,
        rate: 1.0,
        tariff: 1000,
        typeByClassifier: 'Тест'
      },
      {
        id: '2',
        fullName: 'Секретар 2',
        numOfSeats: 5,
        rate: 0.75,
        tariff: 1200,
        typeByClassifier: 'Тест2'
      }
    ];
    localStorage.setItem(this.localStorageKey + parameters.providerId, JSON.stringify(mockData));
    return mockData;
  }
}
