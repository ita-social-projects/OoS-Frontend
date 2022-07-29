import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryLogTableComponent } from './history-log-table.component';

describe('HistoryLogTableComponent', () => {
  let component: HistoryLogTableComponent;
  let fixture: ComponentFixture<HistoryLogTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoryLogTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryLogTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
