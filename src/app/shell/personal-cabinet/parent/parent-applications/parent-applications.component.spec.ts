import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentApplicationsComponent } from './parent-applications.component';

describe('ParentApplicationsComponent', () => {
  let component: ParentApplicationsComponent;
  let fixture: ComponentFixture<ParentApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParentApplicationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
