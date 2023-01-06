import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Codeficator } from 'src/app/shared/models/codeficator.model';
import { Institution } from 'src/app/shared/models/institution.model';
import { GetAllInstitutions, GetCodeficatorSearch } from 'src/app/shared/store/meta-data.actions';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  @Select(MetaDataState.institutions)
  institutions$: Observable<Institution[]>;

  @Select(MetaDataState.codeficatorSearch)
  codeficatorSearch$: Observable<Codeficator[]>;

  filtersForm: FormGroup;
  isReport = false;

  constructor(private fb: FormBuilder, private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch([new GetAllInstitutions(true), new GetCodeficatorSearch('')]);

    this.filtersForm = this.fb.group({
      dateFrom: new FormControl(''),
      dateTo: new FormControl(''),
      institutions: new FormControl(''),
      regions: new FormControl(''),
      otgs: new FormControl('')
    });
  }

  onGenerateReport(): void {
    //TODO: Add report creation logic
  }
}
