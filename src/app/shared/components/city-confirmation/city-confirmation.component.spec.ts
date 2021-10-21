import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';

import { CityConfirmationComponent } from './city-confirmation.component';

describe('CityConfirmationComponent', () => {
  let component: CityConfirmationComponent;
  let fixture: ComponentFixture<CityConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([])],
      declarations: [CityConfirmationComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CityConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
