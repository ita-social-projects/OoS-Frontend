import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonalCabinetComponent } from './personal-cabinet.component';
import { NgxsModule, Store } from '@ngxs/store';
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
