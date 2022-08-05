import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryLogComponent } from './history-log.component';
import {NgxsModule} from "@ngxs/store";
import {RouterTestingModule} from "@angular/router/testing";
import {MatTabsModule} from "@angular/material/tabs";
import {Component, Input} from "@angular/core";
import {NoResultCardComponent} from "../../../../shared/components/no-result-card/no-result-card.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClientModule} from "@angular/common/http";
import {HistoryLogService} from "../../../../shared/services/history-log/history-log.service";

describe('HistoryLogComponent', () => {
  let component: HistoryLogComponent;
  let fixture: ComponentFixture<HistoryLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        RouterTestingModule,
        MatTabsModule,
        BrowserAnimationsModule,
        HttpClientModule
      ],
      declarations: [
        HistoryLogComponent,
        NoResultCardComponent,
        MockHistoryLogTableComponent
      ],
      providers: [
        HistoryLogService
      ]
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

@Component({
  selector: 'app-history-log-table',
  template: ''
})
class MockHistoryLogTableComponent {
  @Input() table: object[];
  @Input() tableTitle: string;
}
