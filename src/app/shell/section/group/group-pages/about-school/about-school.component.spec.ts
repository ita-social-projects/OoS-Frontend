import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutSchoolComponent } from './about-school.component';

describe('AboutSchoolComponent', () => {
  let component: AboutSchoolComponent;
  let fixture: ComponentFixture<AboutSchoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AboutSchoolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutSchoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
