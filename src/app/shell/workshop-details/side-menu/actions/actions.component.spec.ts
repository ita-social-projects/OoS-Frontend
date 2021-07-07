import { User } from 'src/app/shared/models/user.model';
import { Store, NgxsModule } from '@ngxs/store';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActionsComponent } from './actions.component';
import { Workshop } from '../../../../shared/models/workshop.model';
import { RouterTestingModule } from '@angular/router/testing';

describe('ActionsComponent', () => {
  let component: ActionsComponent;
  let fixture: ComponentFixture<ActionsComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NgxsModule.forRoot([])
      ],
      declarations: [ActionsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
    spyOn(store, 'selectSnapshot').and.returnValue({ role: '' } as User)
    fixture = TestBed.createComponent(ActionsComponent);
    component = fixture.componentInstance;
    component.workshop = {} as Workshop;
    component.userRole = '';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
