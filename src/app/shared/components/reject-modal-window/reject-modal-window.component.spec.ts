import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectModalWindowComponent } from './reject-modal-window.component';

describe('RejectModalWindowComponent', () => {
  let component: RejectModalWindowComponent;
  let fixture: ComponentFixture<RejectModalWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectModalWindowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectModalWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
