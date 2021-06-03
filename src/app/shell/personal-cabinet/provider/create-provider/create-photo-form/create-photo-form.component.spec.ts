import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePhotoFormComponent } from './create-photo-form.component';

describe('CreatePhotoFormComponent', () => {
  let component: CreatePhotoFormComponent;
  let fixture: ComponentFixture<CreatePhotoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePhotoFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePhotoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
