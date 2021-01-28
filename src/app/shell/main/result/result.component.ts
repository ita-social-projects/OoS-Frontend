import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { EditResultView } from '../../../shared/result.actions';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
  data$: Observable<Object[]>;
  public selectedVal: string;

  constructor(private store: Store) {
    this.data$ = this.store.select(state => state.ShowData);
    // To do: change "state.ShowData" when state will be configured
  }
  
  ngOnInit(): void {
    this.selectedVal ='show-data';
  }

  public onValChange(val: string) {
    this.selectedVal = val;
    this.store.dispatch(new EditResultView(val));
    // To do: finish action when state will be configured
  }

}
