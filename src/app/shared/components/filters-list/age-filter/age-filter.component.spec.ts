import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgeFilterComponent } from './age-filter.component';
import { NgxsModule, Store } from '@ngxs/store';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MinMaxDirective } from 'src/app/shared/directives/min-max.directive';
import { MatIconModule } from '@angular/material/icon';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { MatButtonModule } from '@angular/material/button';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BrowserModule } from '@angular/platform-browser';

describe('AgeFilterComponent', () => {
  let component: AgeFilterComponent;
  let fixture: ComponentFixture<AgeFilterComponent>;

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
      ],
      declarations: [
        AgeFilterComponent,
        MinMaxDirective],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
