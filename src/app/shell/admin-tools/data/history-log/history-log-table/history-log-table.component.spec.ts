import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';

import { HistoryLogTypes } from 'shared/enum/history.log';
import { HistoryLogTableComponent } from './history-log-table.component';

describe('HistoryLogTableComponent', () => {
  let component: HistoryLogTableComponent;
  let fixture: ComponentFixture<HistoryLogTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatTableModule, RouterTestingModule, MatMenuModule, NgxsModule.forRoot([]), MatIconModule, TranslateModule.forRoot()],
      declarations: [HistoryLogTableComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryLogTableComponent);
    component = fixture.componentInstance;
    component.tableType = HistoryLogTypes.Applications;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return TRUE if isApplicationHistoryType called and tableType is Applications', () => {
    expect(component.isApplicationHistoryType).toBeTruthy();
  });
});
