import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms'
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ChildCard } from 'src/app/shared/models/child-card.model';
import { orgCard } from 'src/app/shared/models/org-card.model';
import { getCards } from 'src/app/shared/store/user.actions';
import { UserState } from 'src/app/shared/store/user.state';

@Component({
  selector: 'app-parent-config',
  templateUrl: './parent-config.component.html',
  styleUrls: ['./parent-config.component.scss']
})
export class ParentConfigComponent implements OnInit {
  form: FormGroup;

  @Select(UserState.childrenCards) childCards$: Observable<ChildCard[]>;
  public cards: ChildCard[];

  constructor(private fb:FormBuilder, private store: Store) { }


  ngOnInit(): void {
    this.store.dispatch(new getCards())
    this.childCards$.subscribe((childCards: ChildCard[]) => this.cards = childCards)


}
}
