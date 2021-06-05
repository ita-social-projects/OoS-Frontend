import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkshopCardComponent } from './workshop-card.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { NgxsModule, Store } from '@ngxs/store';
import { MockStore } from '../../mocks/mock-services';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterTestingModule } from '@angular/router/testing';

describe('WorkshopCardComponent', () => {
  let component: WorkshopCardComponent;
  let fixture: ComponentFixture<WorkshopCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        MatCardModule,
        NgxsModule.forRoot([]),
        FlexLayoutModule,
        RouterTestingModule
      ],
      declarations: [ WorkshopCardComponent ],
      providers: [
        { provide: Store, useValue: MockStore }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
