import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { orgCard } from 'src/app/shared/models/org-card.model';

import { CreateProviderComponent } from './create-provider.component';

describe('CreateProviderComponent', () => {
  let component: CreateProviderComponent;
  let fixture: ComponentFixture<CreateProviderComponent>;

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
<<<<<<< HEAD:src/app/shell/provider/provider-activities/activities-card/activities-card.component.spec.ts
      declarations: [ ActivitiesCardComponent ],
      schemas: [NO_ERRORS_SCHEMA]
=======
      declarations: [ CreateProviderComponent ]
>>>>>>> origin/develop:src/app/shell/personal-cabinet/provider/create-provider/create-provider.component.spec.ts
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProviderComponent);
    component = fixture.componentInstance;
    component.card = mockOrgCard;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
