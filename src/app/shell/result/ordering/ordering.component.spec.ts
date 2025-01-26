import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule, Store } from '@ngxs/store';

import { SetOrder } from 'shared/store/filter.actions';
import { FilterState } from 'shared/store/filter.state';
import { Ordering } from 'shared/enum/ordering';
import { HttpClientModule } from '@angular/common/http';
import { OrderingComponent } from './ordering.component';

describe('OrderingComponent', () => {
  let component: OrderingComponent;
  let fixture: ComponentFixture<OrderingComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderingComponent],
      imports: [
        HttpClientModule,
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        BrowserAnimationsModule,
        NgxsModule.forRoot([FilterState]),
        TranslateModule.forRoot()
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderingComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    store.reset({
      filter: {
        filterList: { order: Ordering.rating }
      }
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch SetOrder when option selected', () => {
    jest.spyOn(store, 'dispatch');
    const mockEvent = new MatSelectChange(null, 'test');

    component.onSelectOption(mockEvent);

    expect(store.dispatch).toHaveBeenCalledWith(new SetOrder(mockEvent.value));
  });
});
