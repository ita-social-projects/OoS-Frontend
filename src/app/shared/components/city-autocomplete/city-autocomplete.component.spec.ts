import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CityAutocompleteComponent } from './city-autocomplete.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgxsModule } from '@ngxs/store';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { Component } from '@angular/core';

describe('CityAutocompleteComponent', () => {
  let component: CityAutocompleteComponent;
  let fixture: ComponentFixture<CityAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        NgxsModule.forRoot([]),
      ],
      declarations: [
        CityAutocompleteComponent,],
      providers: []
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CityAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
