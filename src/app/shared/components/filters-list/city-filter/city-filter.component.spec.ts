import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CityFilterComponent } from './city-filter.component';
import { NgxsModule } from '@ngxs/store';
import { Component } from '@angular/core';

describe('CityFilterComponent', () => {
  let component: CityFilterComponent;
  let fixture: ComponentFixture<CityFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
      ],
      declarations: [
        CityFilterComponent,
        MockCityConfirmationComponent
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CityFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'app-city-confirmation',
  template: ''
})
class MockCityConfirmationComponent { }
