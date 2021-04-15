import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HobbySelectComponent } from './hobby-select.component';

describe('HobbySelectComponent', () => {
  let component: HobbySelectComponent;
  let fixture: ComponentFixture<HobbySelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HobbySelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HobbySelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
