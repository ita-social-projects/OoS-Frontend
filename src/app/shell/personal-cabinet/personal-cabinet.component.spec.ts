import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonalCabinetComponent } from './personal-cabinet.component';
import { NgxsModule, Store } from '@ngxs/store';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { User } from '../../shared/models/user.model';

describe('PersonalCabinetComponent', () => {
  let component: PersonalCabinetComponent;
  let fixture: ComponentFixture<PersonalCabinetComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        RouterTestingModule
      ],
      declarations: [PersonalCabinetComponent],
    })
      .compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
    jest.spyOn(store, 'selectSnapshot').mockReturnValue(() => of({ role: '' } as User));

    fixture = TestBed.createComponent(PersonalCabinetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
