import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, of, throwError } from 'rxjs';
import { Position, PositionParameters } from 'shared/models/position.model';
import { Provider } from 'shared/models/provider.model';
import { RegistrationState } from 'shared/store/registration.state';

@Injectable({
  providedIn: 'root'
})
export class PositionService {
  @Select(RegistrationState.provider) public provider: Provider;
  private readonly localStorageKey = 'positions_';

  constructor(private readonly store: Store) {}

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

  public createPosition(position: Position): Observable<Position> {
    const providerId = position.provider;
    const positionParameters = { providerId: providerId };
    const positions = this.getPositions(positionParameters);
    const newPosition = { ...position, id: this.generateId() };
    positions.push(newPosition);

    localStorage.setItem(this.localStorageKey + providerId, JSON.stringify(positions));
    return of(newPosition);
  }

  public updatePosition(position: Position): Observable<Position> {
    const providerId = position.provider;
    const positionParameters = { providerId: providerId };
    const positions = this.getPositions(positionParameters);
    const index = positions.findIndex((p) => p.id === position.id);

    if (index !== -1) {
      positions[index] = { ...positions[index], ...position };
      localStorage.setItem(this.localStorageKey + providerId, JSON.stringify(positions));
      return of(positions[index]);
    } else {
      return throwError(() => new Error(`Position with id ${position.id} not found`));
    }
  }

  public deletePosition(positionParameters: PositionParameters, positionId: string): Observable<Position[]> {
    let positions = this.getPositions(positionParameters);
    const index = positions.findIndex((p) => p.id === positionId);

    if (index !== -1) {
      positions = positions.filter((p) => p.id !== positionId);
      localStorage.setItem(this.localStorageKey + positionParameters.providerId, JSON.stringify(positions));
      return of(positions);
    } else {
      return throwError(() => new Error(`Position with id ${positionId} not found`));
    }
  }

  public getPositionById(positionId: string): Observable<Position> {
    const providerId = '08da842d-12fc-4865-85c5-ec6e6142abad';

    if (!providerId) {
      return throwError(() => new Error('Provider ID is not available'));
    }

    const localData = localStorage.getItem(this.localStorageKey + providerId);
    if (localData) {
      const positions: Position[] = JSON.parse(localData);
      const position = positions.find((p) => p.id === positionId);
      if (position) {
        return of(position);
      }
    }
    return throwError(() => new Error(`Position with id ${positionId} not found`));
  }
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
