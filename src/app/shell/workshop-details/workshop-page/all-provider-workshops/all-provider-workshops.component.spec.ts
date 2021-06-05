import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllProviderWorkshopsComponent } from './all-provider-workshops.component';

describe('AllProviderWorkshopsComponent', () => {
  let component: AllProviderWorkshopsComponent;
  let fixture: ComponentFixture<AllProviderWorkshopsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllProviderWorkshopsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllProviderWorkshopsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
