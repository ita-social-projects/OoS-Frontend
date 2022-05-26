import { Observable, of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { NgxsModule } from '@ngxs/store';

import { CityConfirmationComponent } from './city-confirmation.component';
import { City } from '../../models/city.model';

describe('CityConfirmationComponent', () => {
  let component: CityConfirmationComponent;
  let fixture: ComponentFixture<CityConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([]), MatIconModule],
      declarations: [CityConfirmationComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CityConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
