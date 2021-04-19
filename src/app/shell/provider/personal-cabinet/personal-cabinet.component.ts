import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { ChangePage } from '../../../shared/store/app.actions';

@Component({
  selector: 'app-personal-cabinet',
  templateUrl: './personal-cabinet.component.html',
  styleUrls: ['./personal-cabinet.component.scss']
})
export class PersonalCabinetComponent implements OnInit {

  constructor(private store: Store) {
  }

  ngOnInit(): void {
    this.store.dispatch(new ChangePage(false));
  }

}
