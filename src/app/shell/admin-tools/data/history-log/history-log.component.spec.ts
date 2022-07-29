import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryLogComponent } from './history-log.component';

describe('HistoryLogComponent', () => {
  let component: HistoryLogComponent;
  let fixture: ComponentFixture<HistoryLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoryLogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
