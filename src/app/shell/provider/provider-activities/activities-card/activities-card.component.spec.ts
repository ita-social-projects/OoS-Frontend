import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { orgCard } from 'src/app/shared/models/org-card.model';

import { ActivitiesCardComponent } from './activities-card.component';

describe('ActivitiesCardComponent', () => {
  let component: ActivitiesCardComponent;
  let fixture: ComponentFixture<ActivitiesCardComponent>;

  const mockOrgCard: orgCard = {
    title: 'string',
    owner: 'string',
    city: 'string',
    address: 'string',
    ownership: 'string',
    price: 123,
    rate: 'string',
    votes: 'string',
    ageFrom: 2,
    ageTo: 5,
    category: ['sport'],
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivitiesCardComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitiesCardComponent);
    component = fixture.componentInstance;
    component.card = mockOrgCard;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
