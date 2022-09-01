import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { NoResultCardComponent } from 'src/app/shared/components/no-result-card/no-result-card.component';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { AllProviderWorkshopsComponent } from './all-provider-workshops.component';

describe('AllProviderWorkshopsComponent', () => {
  let component: AllProviderWorkshopsComponent;
  let fixture: ComponentFixture<AllProviderWorkshopsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
      ],
      declarations: [
        AllProviderWorkshopsComponent,
        MockProviderWorkshopCardComponent,
        NoResultCardComponent
      ]
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

@Component({
  selector: 'app-workshop-card',
  template: ''
})
class MockProviderWorkshopCardComponent {
  @Input() workshop: Workshop;
  @Input() isCreateFormView: boolean;
}
