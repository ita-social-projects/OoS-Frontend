import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationCardListComponent } from './organization-card-list.component';

describe('OrganizationCardListComponent', () => {
  let component: OrganizationCardListComponent;
  let fixture: ComponentFixture<OrganizationCardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationCardListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
