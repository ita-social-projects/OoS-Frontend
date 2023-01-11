import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { StatisticPeriod, StatisticFileFormat } from '../../../../shared/enum/statistics';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  readonly StatisticsPeriod = StatisticPeriod;
  readonly StatisticsFileFormat = StatisticFileFormat;

  filtersForm: FormGroup;
  isReport = false;

  constructor(private fb: FormBuilder, private store: Store) {}

  ngOnInit(): void {
    this.filtersForm = this.fb.group({
      period: new FormControl(StatisticPeriod.WorkshopsDaily),
      format: new FormControl(StatisticFileFormat.CSV)
    });
  }

  onGenerateReport(): void {
    //TODO: Add report creation logic
  }
}
