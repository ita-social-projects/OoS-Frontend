import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParentConfigComponent } from './parent-config.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxsModule, Store } from '@ngxs/store';
import { MockStore } from '../../../../shared/mocks/mock-services';
import { MatCardModule } from '@angular/material/card';

describe('ParentConfigComponent', () => {
  let component: ParentConfigComponent;
  let fixture: ComponentFixture<ParentConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        MatCardModule,
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [ ParentConfigComponent ],
      providers: [
        { provide: Store, useValue: MockStore },
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentConfigComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
