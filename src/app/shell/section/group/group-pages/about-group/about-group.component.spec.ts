import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutGroupComponent } from './about-group.component';

describe('AboutGroupComponent', () => {
  let component: AboutGroupComponent;
  let fixture: ComponentFixture<AboutGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AboutGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
