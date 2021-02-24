import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderActivitiesComponent } from './provider-activities.component';

describe('ProviderActivitiesComponent', () => {
  let component: ProviderActivitiesComponent;
  let fixture: ComponentFixture<ProviderActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProviderActivitiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
