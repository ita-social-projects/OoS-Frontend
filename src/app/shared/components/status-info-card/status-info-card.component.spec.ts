import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusInfoCardComponent } from './status-info-card.component';

describe('StatusInfoCardComponent', () => {
  let component: StatusInfoCardComponent;
  let fixture: ComponentFixture<StatusInfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusInfoCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
