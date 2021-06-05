import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonalCabinetComponent } from './personal-cabinet.component';
import { Store } from '@ngxs/store';
import { MockStore } from '../../shared/mocks/mock-services';
import { RouterTestingModule } from '@angular/router/testing';

describe('PersonalCabinetComponent', () => {
  let component: PersonalCabinetComponent;
  let fixture: ComponentFixture<PersonalCabinetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
