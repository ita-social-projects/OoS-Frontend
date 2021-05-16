// import { Component, OnInit } from '@angular/core';
// import { Select, Store } from '@ngxs/store';
// import { FilterState } from '../../../../../shared/store/filter.state';
// import { Observable } from 'rxjs';
// import { GetPopWorkshops } from '../../../../../shared/store/filter.actions';
// import { Workshop } from '../../../../../shared/models/workshop.model';

// @Component({
//   selector: 'app-school-classes',
//   templateUrl: './school-classes.component.html',
// })
// export class SchoolClassesComponent implements OnInit {

//   @Select(FilterState.workshopsCards) cards$: Observable<Workshop[]>;

//   public cards: Workshop[];

//   constructor(private store: Store) {
//   }

//   ngOnInit(): void {
//     this.store.dispatch(new GetPopWorkshops());
//     this.cards$.subscribe((cards: Workshop[]) => this.cards = cards);
//   }
// }
