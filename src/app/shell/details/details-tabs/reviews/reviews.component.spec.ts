import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';

import { NoResultCardComponent } from 'shared/components/no-result-card/no-result-card.component';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { Parent } from 'shared/models/parent.model';
import { Rate } from 'shared/models/rating';
import { SearchResponse } from 'shared/models/search.model';
import { Workshop } from 'shared/models/workshop.model';
import { DeclinationPipe } from 'shared/pipes/declination.pipe';
import { TranslateCasesPipe } from 'shared/pipes/translate-cases.pipe';
import { ReviewsComponent } from './reviews.component';
import { StarsComponent } from './stars/stars.component';

@Component({
  selector: 'app-paginator',
  template: ''
})
class MockReviewsPaginatorComponent {
  @Input() totalEntities: number;
  @Input() currentPage: PaginationElement;
  @Input() itemsPerPage: number;
}

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
        MatButtonToggleModule,
        TranslateModule.forRoot()
      ],
      providers: [TranslateService],
      declarations: [
        ReviewsComponent,
        StarsComponent,
        DeclinationPipe,
        NoResultCardComponent,
        MockReviewsPaginatorComponent,
        TranslateCasesPipe
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
    jest.spyOn(store, 'selectSnapshot').mockReturnValue(() => of({} as Parent));
    fixture = TestBed.createComponent(ReviewsComponent);
    component = fixture.componentInstance;
    component.workshop = {} as Workshop;
    component.parent = {} as Parent;
    component.rating = {} as SearchResponse<Rate[]>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
