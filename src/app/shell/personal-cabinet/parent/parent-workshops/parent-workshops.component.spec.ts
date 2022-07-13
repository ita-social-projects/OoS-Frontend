import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentWorkshopsComponent } from './parent-workshops.component';

describe('ParentWorkshopsComponent', () => {
  let component: ParentWorkshopsComponent;
  let fixture: ComponentFixture<ParentWorkshopsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParentWorkshopsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentWorkshopsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
