import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateWorkshopComponent } from './create-workshop.component';
import { MatStepperModule } from '@angular/material/stepper';
import { Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsModule } from '@ngxs/store';

describe('CreateWorkshopComponent', () => {
  let component: CreateWorkshopComponent;
  let fixture: ComponentFixture<CreateWorkshopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatStepperModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        NgxsModule.forRoot([]),
      ],
      declarations: [
        CreateWorkshopComponent,
        MockCreateAddressComponent,
        MockCreateTeacherComponent,
        MockCreateAboutFormComponent,
        MockCreateDescriptionFormComponent
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWorkshopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'app-create-about-form',
  template: ''
})
class MockCreateAboutFormComponent {
}

@Component({
  selector: 'app-create-description-form',
  template: ''
})
class MockCreateDescriptionFormComponent {
}

@Component({
  selector: 'app-create-address',
  template: ''
})
class MockCreateAddressComponent {
}

@Component({
  selector: 'app-create-teacher',
  template: ''
})
class MockCreateTeacherComponent {
}
