import { MatIconModule } from '@angular/material/icon';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { MinMaxDirective } from 'shared/directives/min-max.directive';
import { ValidationConstants } from 'shared/constants/validation';
import { PriceFilterComponent } from './price-filter.component';

describe('PriceFilterComponent', () => {
  let component: PriceFilterComponent;
  let fixture: ComponentFixture<PriceFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatCheckboxModule,
        MatFormFieldModule,
        NgxSliderModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatSelectModule,
        BrowserAnimationsModule,
        NgxsModule.forRoot([]),
        MatIconModule,
        TranslateModule.forRoot()
      ],
      declarations: [PriceFilterComponent, MinMaxDirective]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set min price to MIN_PRICE if min control is empty on blur', () => {
    component.minPriceControl.setValue(NaN);
    component.onPriceBlur('min');
    expect(component.minPriceControl.value).toBe(ValidationConstants.MIN_PRICE);
  });

  it('should set max price to MAX_PRICE if max control is empty on blur', () => {
    component.maxPriceControl.setValue(NaN);
    component.onPriceBlur('max');
    expect(component.maxPriceControl.value).toBe(ValidationConstants.MAX_PRICE);
  });
});
