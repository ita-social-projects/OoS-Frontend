// import { Component, OnInit } from '@angular/core';
// import { GetTeachersCards } from '../../../../../shared/store/filter.actions';
// import { Select, Store } from '@ngxs/store';
// import { FilterState } from '../../../../../shared/store/filter.state';
// import { Observable } from 'rxjs';
// import { TeacherCard } from '../../../../../shared/models/teachers-card.model';

// @Component({
//   selector: 'app-teachers',
//   templateUrl: './teachers.component.html',
//   styleUrls: ['./teachers.component.scss']
// })
// export class TeachersComponent implements OnInit {
//   @Select(FilterState.teacherCards) $teachersCards: Observable<TeacherCard[]>;
//   teacherCard = [];

//   constructor(private store: Store) {
//   }

//   ngOnInit(): void {
//     this.store.dispatch(new GetTeachersCards());
//     this.$teachersCards.subscribe(value => this.teacherCard = value);
//   }

// }
