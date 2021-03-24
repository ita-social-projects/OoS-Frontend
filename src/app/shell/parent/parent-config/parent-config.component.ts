import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms'
import { Store } from '@ngxs/store';
import { ChildCard } from 'src/app/shared/models/child-card.model';
import { ChildCardService } from 'src/app/shared/services/child-cards/child-cards.service';
import { ChangePage } from 'src/app/shared/store/app.actions';


@Component({
  selector: 'app-parent-config',
  templateUrl: './parent-config.component.html',
  styleUrls: ['./parent-config.component.scss']
})
export class ParentConfigComponent implements OnInit {
  form: FormGroup;


  public cards: ChildCard[];

  constructor(private fb:FormBuilder, private childCardsService : ChildCardService, private store: Store) { }


  ngOnInit(): void {
    this.store.dispatch(new ChangePage(false));
    this.childCardsService.getCards()
    .subscribe((data)=>{
      this.cards=data;
  })

}
}
