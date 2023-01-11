import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  filtersForm: FormGroup;
  isReport = false;

  constructor(private fb: FormBuilder, private store: Store) {}

  ngOnInit(): void {
    this.filtersForm = this.fb.group({
      period: new FormControl('WorkshopsDaily'),
      format: new FormControl('CSV')
    });
  }

  onGenerateReport(): void {
    //TODO: Add report creation logic
  }
}
