import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentAddChildComponent } from './parent-add-child.component';

describe('ParentAddChildComponent', () => {
  let component: ParentAddChildComponent;
  let fixture: ComponentFixture<ParentAddChildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParentAddChildComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentAddChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
