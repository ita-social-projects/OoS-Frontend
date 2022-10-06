import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryLogTableComponent } from './history-log-table.component';
import {MatTableModule} from '@angular/material/table';
import {RouterTestingModule} from '@angular/router/testing';
import {MatMenuModule} from '@angular/material/menu';
import {NgxsModule} from '@ngxs/store';
import {MatIconModule} from '@angular/material/icon';

describe('HistoryLogTableComponent', () => {
  let component: HistoryLogTableComponent;
  let fixture: ComponentFixture<HistoryLogTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        RouterTestingModule,
        MatMenuModule,
        NgxsModule.forRoot([]),
        MatIconModule,
      ],
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
