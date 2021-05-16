import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/shared/store/app.state';
import { Teacher } from 'src/app/shared/models/teacher.model';
import { GetTeachersById } from 'src/app/shared/store/app.actions';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.scss']
})
export class TeachersComponent implements OnInit {
  @Select(AppState.teachers) teachers$: Observable<Teacher[]>;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new GetTeachersById(null));
  }

}
