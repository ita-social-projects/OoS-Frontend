import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationCardsListComponent } from './organization-cards-list.component';

describe('OrganizationCardsListComponent', () => {
  let component: OrganizationCardsListComponent;
  let fixture: ComponentFixture<OrganizationCardsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationCardsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationCardsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
