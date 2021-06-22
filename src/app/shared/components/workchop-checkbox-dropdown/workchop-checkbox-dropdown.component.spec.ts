import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { WorkchopCheckboxDropdownComponent } from './workchop-checkbox-dropdown.component';

describe('WorkchopCheckboxDropdownComponent', () => {
  let component: WorkchopCheckboxDropdownComponent;
  let fixture: ComponentFixture<WorkchopCheckboxDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
      ],
      declarations: [WorkchopCheckboxDropdownComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkchopCheckboxDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
