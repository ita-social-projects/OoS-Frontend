import { Component, OnInit } from '@angular/core';
import { UpdateCurrentView } from '../../shared/result.actions';
import { Store } from '@ngxs/store';
import { ChangePage } from 'src/app/shared/store/app.actions';

export interface Option {
  value: string;
  viewValue: string;
  arrow: string;
}

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
  public currentView: string;
  isFiltersVisible: boolean = true;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new ChangePage(false));
    this.currentView = 'show-data';
  }

  public SetCurrentView(view: string) {
    this.currentView = view;
    this.store.dispatch(new UpdateCurrentView(view));
  }
}
