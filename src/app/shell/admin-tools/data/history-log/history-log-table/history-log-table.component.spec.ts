import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';

import { ApplicationTitles } from 'shared/enum/enumUA/statuses';
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

  describe('getCustomLogValue method', () => {
    it('should return HISTORY_LOG.USER_WAS_BLOCKED for oldValue when operationType is Block and oldValue is truthy', () => {
      const element = { operationType: 'Block', oldValue: '1' } as any;

      const result = component.getCustomLogValue(element, 'oldValue');

      expect(result).toBe('HISTORY_LOG.USER_WAS_BLOCKED');
    });

    it('should return HISTORY_LOG.USER_WAS_UNBLOCKED for oldValue when operationType is Block and oldValue is falsy', () => {
      const element = { operationType: 'Block', oldValue: '0' } as any;

      const result = component.getCustomLogValue(element, 'oldValue');

      expect(result).toBe('HISTORY_LOG.USER_WAS_UNBLOCKED');
    });

    it('should return status title for oldValue when isApplicationHistoryType is true', () => {
      const element = { oldValue: 'Pending' } as any;
      jest.spyOn(component, 'isApplicationHistoryType', 'get').mockReturnValue(true);

      const result = component.getCustomLogValue(element, 'oldValue');

      expect(result).toBe(ApplicationTitles.Pending);
    });

    it('should return oldValue directly when isApplicationHistoryType is false', () => {
      const element = { oldValue: 'someValue' } as any;
      jest.spyOn(component, 'isApplicationHistoryType', 'get').mockReturnValue(false);

      const result = component.getCustomLogValue(element, 'oldValue');

      expect(result).toBe('someValue');
    });

    it('should return HISTORY_LOG.USER_WAS_BLOCKED for newValue when operationType is Block and newValue is truthy', () => {
      const element = { operationType: 'Block', newValue: '1' } as any;

      const result = component.getCustomLogValue(element, 'newValue');

      expect(result).toBe('HISTORY_LOG.USER_WAS_BLOCKED');
    });

    it('should return HISTORY_LOG.USER_WAS_UNBLOCKED for newValue when operationType is Block and newValue is falsy', () => {
      const element = { operationType: 'Block', newValue: '0' } as any;

      const result = component.getCustomLogValue(element, 'newValue');

      expect(result).toBe('HISTORY_LOG.USER_WAS_UNBLOCKED');
    });

    it('should return status title for newValue when isApplicationHistoryType is true', () => {
      const element = { newValue: 'Approved' } as any;
      jest.spyOn(component, 'isApplicationHistoryType', 'get').mockReturnValue(true);

      const result = component.getCustomLogValue(element, 'newValue');

      expect(result).toBe(ApplicationTitles.Approved);
    });

    it('should return newValue directly when isApplicationHistoryType is false', () => {
      const element = { newValue: 'anotherValue' } as any;
      jest.spyOn(component, 'isApplicationHistoryType', 'get').mockReturnValue(false);

      const result = component.getCustomLogValue(element, 'newValue');

      expect(result).toBe('anotherValue');
    });

    it('should return empty string for unknown column', () => {
      const element = {} as any;

      const result = component.getCustomLogValue(element, 'unknownColumn');

      expect(result).toBe('');
    });
  });
});
