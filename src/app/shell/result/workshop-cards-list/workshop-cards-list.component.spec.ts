import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkshopCardsListComponent } from './workshop-cards-list.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxsModule, Store } from '@ngxs/store';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { Workshop } from '../../../shared/models/workshop.model';
import { User } from 'src/app/shared/models/user.model';

const MockUser = {
  role: '',
};

describe('WorkshopCardsListComponentt', () => {
  let component: WorkshopCardsListComponent;
  let fixture: ComponentFixture<WorkshopCardsListComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        WorkshopCardsListComponent,
        MockOrderingComponent,
        MockListWorkshopCardComponent
      ],
      imports: [
        FlexLayoutModule,
        CommonModule,
        NgxsModule.forRoot([ ]),
        NgxPaginationModule
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
    spyOn(store, 'selectSnapshot').and.returnValue(MockUser as User);

    fixture = TestBed.createComponent(WorkshopCardsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'app-ordering-menu',
  template: ''
})
class MockOrderingComponent {
}

@Component({
  selector: 'app-workshop-card',
  template: ''
})
class MockListWorkshopCardComponent {
  @Input() workshop: Workshop;
  @Input() isMainPage: boolean;
  @Input() userRole: string;
}


