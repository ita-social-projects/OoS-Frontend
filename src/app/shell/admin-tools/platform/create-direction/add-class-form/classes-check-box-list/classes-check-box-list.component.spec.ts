import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassesCheckBoxListComponent } from './classes-check-box-list.component';

describe('ClassesCheckBoxListComponent', () => {
  let component: ClassesCheckBoxListComponent;
  let fixture: ComponentFixture<ClassesCheckBoxListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassesCheckBoxListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassesCheckBoxListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
