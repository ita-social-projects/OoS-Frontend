import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule, Store } from '@ngxs/store';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';

import { MinMaxDirective } from 'shared/directives/min-max.directive';
import { MaterialModule } from 'shared/modules/material.module';
import { SetIsAppropriateAge, SetMaxAge, SetMinAge } from 'shared/store/filter.actions';
import { AgeFilterComponent } from './age-filter.component';

describe('AgeFilterComponent', () => {
  let component: AgeFilterComponent;
  let fixture: ComponentFixture<AgeFilterComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatInputModule,
        NgxsModule.forRoot([]),
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatIconModule,
        BrowserModule,
        MatDatepickerModule,
        NgxMatTimepickerModule,
        MatButtonModule,
        MaterialModule,
        TranslateModule.forRoot()
      ],
      declarations: [AgeFilterComponent, MinMaxDirective]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgeFilterComponent);
    component = fixture.componentInstance;
    component.ageFilter = { minAge: 0, maxAge: 120, isAppropriateAge: false };
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form controls value changes', () => {
    beforeEach(() => jest.spyOn(store, 'dispatch'));

    it('should dispatch SetMinAge when minAgeFormControl value changes', fakeAsync(() => {
      const mockMinAge = 5;

      component.minAgeFormControl.setValue(mockMinAge);
      tick(500);

      expect(store.dispatch).toHaveBeenCalledWith(new SetMinAge(mockMinAge));
    }));

    it('should dispatch SetMaxAge when maxAgeFormControl value changes', fakeAsync(() => {
      const mockMaxAge = 14;

      component.maxAgeFormControl.setValue(mockMaxAge);
      tick(500);

      expect(store.dispatch).toHaveBeenCalledWith(new SetMaxAge(mockMaxAge));
    }));

    it('should dispatch SetIsAppropriateAge when isAppropriateAgeControl value changes', fakeAsync(() => {
      const mockIsAppropriateAge = true;

      component.isAppropriateAgeControl.setValue(mockIsAppropriateAge);
      tick(500);

      expect(store.dispatch).toHaveBeenCalledWith(new SetIsAppropriateAge(mockIsAppropriateAge));
    }));
  });

  it('should reset minAgeFormControl when clearMin called', () => {
    jest.spyOn(component.minAgeFormControl, 'reset');

    component.clearMin();

    expect(component.minAgeFormControl.reset).toHaveBeenCalled();
  });

  it('should reset maxAgeFormControl when clearMax called', () => {
    jest.spyOn(component.maxAgeFormControl, 'reset');

    component.clearMax();

    expect(component.maxAgeFormControl.reset).toHaveBeenCalled();
  });
});
