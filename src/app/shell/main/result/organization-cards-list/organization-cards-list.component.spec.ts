import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrganizationCardsListComponent } from './organization-cards-list.component';
import { OrderingComponent } from './ordering/ordering.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxsModule, Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterState } from 'src/app/shared/store/filter.state';

describe('OrganizationCardsListComponent', () => {
  let component: OrganizationCardsListComponent;
  let fixture: ComponentFixture<OrganizationCardsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
        OrganizationCardsListComponent,
        OrderingComponent
      ],
      imports: [
        FlexLayoutModule,
        CommonModule,
        NgxsModule.forRoot([FilterState]),
      ], 
      providers:[
        {provide: Store, useClass: MockStore}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationCardsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
@Injectable({
  providedIn: 'root'
})
class MockStore{} 
