import { ComponentFixture, TestBed } from '@angular/core/testing';
<<<<<<< HEAD:src/app/shell/result/organization-cards-list/organization-cards-list.component.spec.ts
import { OrganizationCardsListComponent } from './organization-cards-list.component';
import { NgxsModule } from '@ngxs/store';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
=======
import { WorkshopCardsListComponent } from './workshop-cards-list.component';
import { OrderingComponent } from '../ordering/ordering.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxsModule, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterState } from 'src/app/shared/store/filter.state';
>>>>>>> origin/develop:src/app/shell/result/workshop-cards-list/workshop-cards-list.component.spec.ts

describe('WorkshopCardsListComponentt', () => {
  let component: WorkshopCardsListComponent;
  let fixture: ComponentFixture<WorkshopCardsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
<<<<<<< HEAD:src/app/shell/result/organization-cards-list/organization-cards-list.component.spec.ts
        OrganizationCardsListComponent,
=======
        WorkshopCardsListComponent,
        OrderingComponent
>>>>>>> origin/develop:src/app/shell/result/workshop-cards-list/workshop-cards-list.component.spec.ts
      ],
      imports: [
        NgxPaginationModule,
        NgxsModule.forRoot([]),
      ], 
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopCardsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
<<<<<<< HEAD:src/app/shell/result/organization-cards-list/organization-cards-list.component.spec.ts
=======
@Injectable({
  providedIn: 'root'
})
class MockStore{
   
} 
>>>>>>> origin/develop:src/app/shell/result/workshop-cards-list/workshop-cards-list.component.spec.ts
