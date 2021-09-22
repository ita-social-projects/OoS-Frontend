import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgeFilterComponent } from './age-filter.component';
import { NgxsModule, Store } from '@ngxs/store';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MinMaxDirective } from 'src/app/shared/directives/min-max.directive';

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
