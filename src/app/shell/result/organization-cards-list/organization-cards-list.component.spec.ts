import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrganizationCardsListComponent } from './organization-cards-list.component';
import { NgxsModule } from '@ngxs/store';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';

describe('OrganizationCardsListComponent', () => {
  let component: OrganizationCardsListComponent;
  let fixture: ComponentFixture<OrganizationCardsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
        OrganizationCardsListComponent,
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
    fixture = TestBed.createComponent(OrganizationCardsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
