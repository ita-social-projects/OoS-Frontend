import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { ChangePage } from 'src/app/shared/store/app.actions';

@Component({
  selector: 'app-parent-add-child',
  templateUrl: './parent-add-child.component.html',
  styleUrls: ['./parent-add-child.component.scss']
})
export class ParentAddChildComponent implements OnInit {

  public forms : number;

  
  constructor( private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new ChangePage(false));
    this.forms = 1;
  }
 addChild(){
   this.forms = this.forms;
 }
}
