import { Component, OnInit } from '@angular/core';
import { UpdateCurrentView } from '../../../shared/result.actions';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
  public currentView: string;

  constructor(private store: Store) {}
  
  ngOnInit(): void {
    this.currentView ='show-data';
  }

  public SetCurrentView(view: string) {
    this.currentView = view;
    this.store.dispatch(new UpdateCurrentView(view));
    // To do: finish action when state will be configured
  }

}
