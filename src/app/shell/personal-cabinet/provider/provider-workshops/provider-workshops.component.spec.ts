import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProviderWorkshopsComponent } from './provider-workshops.component';



describe('ProviderActivitiesComponent', () => {
  let component: ProviderWorkshopsComponent;
  let fixture: ComponentFixture<ProviderWorkshopsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProviderWorkshopsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderWorkshopsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
