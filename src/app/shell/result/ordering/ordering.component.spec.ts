import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Option } from '../result.component';
import { OrderingComponent } from './ordering.component';

describe('OrderingComponent', () => {
  let component: OrderingComponent;
  let fixture: ComponentFixture<OrderingComponent>;
  let spyToggle;
  const mockedOptions: Option[] = [
    {value: 'ratingDesc', viewValue: 'Рейтинг'},
    {value: 'ratingAsc', viewValue: 'Рейтинг'},
    {value: 'priceDesc', viewValue: 'Ціна'},
    {value: 'priceAsc', viewValue: 'Ціна'}
  ]
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
        OrderingComponent 
      ],
      imports: [
        MatButtonModule,
        MatIconModule
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderingComponent);
    component = fixture.componentInstance;
    component.options = mockedOptions;
    spyToggle = spyOn(component, 'toggleOptions');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event on select, with selected option by id and toggle visibility', () => {
    const spyOnChange =  spyOn(component.onChange, 'emit');
    const selectedIndex = 1;
    component.selectOrder(selectedIndex);
    expect(spyOnChange).toBeCalledWith(component.options[selectedIndex].value);
    expect(spyToggle).toBeCalledTimes(1);
  });

  it('should change visibile variable', () => {
    component.visible = false;
    component.toggleOptions();
    expect(component.visible).toBeFalsy();
  });
});
