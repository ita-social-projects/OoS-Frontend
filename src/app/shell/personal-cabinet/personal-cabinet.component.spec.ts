import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonalCabinetComponent } from './personal-cabinet.component';
import { NgxsModule, Store } from '@ngxs/store';
import { MockStore } from '../../shared/mocks/mock-services';
import { RouterTestingModule } from '@angular/router/testing';

describe('PersonalCabinetComponent', () => {
  let component: PersonalCabinetComponent;
  let fixture: ComponentFixture<PersonalCabinetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        RouterTestingModule
      ],
      declarations: [ PersonalCabinetComponent ],
      providers: [
        { provide: Store, useValue: MockStore },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalCabinetComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
