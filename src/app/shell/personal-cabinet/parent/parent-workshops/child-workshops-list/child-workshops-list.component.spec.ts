import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildWorkshopsListComponent } from './child-workshops-list.component';

describe('ChildWorkshopsListComponent', () => {
  let component: ChildWorkshopsListComponent;
  let fixture: ComponentFixture<ChildWorkshopsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChildWorkshopsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildWorkshopsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
