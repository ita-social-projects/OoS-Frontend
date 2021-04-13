import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDescriptionFormComponent } from './create-description-form.component';

describe('CreateDescriptionFormComponent', () => {
  let component: CreateDescriptionFormComponent;
  let fixture: ComponentFixture<CreateDescriptionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateDescriptionFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDescriptionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
