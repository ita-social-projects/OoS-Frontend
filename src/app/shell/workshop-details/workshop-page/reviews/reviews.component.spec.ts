import { StarsComponent } from './../../../../shared/components/stars/stars.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxsModule, Store } from '@ngxs/store';

import { Parent } from 'src/app/shared/models/parent.model';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { ReviewsComponent } from './reviews.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

describe('ReviewsComponent', () => {
  let component: ReviewsComponent;
  let fixture: ComponentFixture<ReviewsComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        MatDialogModule,
        MatIconModule,
        MatTooltipModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonToggleModule
      ],
      declarations: [
        ReviewsComponent,
        StarsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
    spyOn(store, 'selectSnapshot').and.returnValue({} as Parent);
    fixture = TestBed.createComponent(ReviewsComponent);
    component = fixture.componentInstance;
    component.workshop = {} as Workshop;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
