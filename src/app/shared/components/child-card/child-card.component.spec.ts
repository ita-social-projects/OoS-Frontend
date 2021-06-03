import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChildCard } from 'src/app/shared/models/child-card.model';

import { ChildCardComponent } from './child-card.component';

describe('ChildCardComponent', () => {
  let component: ChildCardComponent;
  let fixture: ComponentFixture<ChildCardComponent>;

  const mockedChildCard: ChildCard = {
    name: 'test',
    surname: 'test',
    lastName: 'test',
    gender: 'test',
    birth: 123,
    socialGroup: 'test',
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChildCardComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildCardComponent);
    component = fixture.componentInstance;
    //component.card = mockedChildCard;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
