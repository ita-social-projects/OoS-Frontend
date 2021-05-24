import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInfoFormComponent } from './create-info-form.component';

describe('CreateInfoFormComponent', () => {
  let component: CreateInfoFormComponent;
  let fixture: ComponentFixture<CreateInfoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateInfoFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateInfoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
