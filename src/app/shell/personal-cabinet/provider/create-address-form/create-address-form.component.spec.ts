import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAddressFormComponent } from './create-address-form.component';

describe('CreateAddressFormComponent', () => {
  let component: CreateAddressFormComponent;
  let fixture: ComponentFixture<CreateAddressFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAddressFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAddressFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
