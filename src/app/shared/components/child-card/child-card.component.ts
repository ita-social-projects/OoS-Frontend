import { Component, Input, OnInit } from '@angular/core';
import { Child } from '../../models/child.model';
import { Workshop } from '../../models/workshop.model';

@Component({
  selector: 'app-child-card',
  templateUrl: './child-card.component.html',
  styleUrls: ['./child-card.component.scss']
})
export class ChildCardComponent implements OnInit {

  @Input() child: Child;

  workshops: Workshop[];

  constructor() { }

  ngOnInit(): void { }

  /**
   * This method get of the child
   * @param string birth date
  * @returns number Age
  */
  getAge(): number {
    const today = new Date();
    const birthDate = new Date(this.child.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  onEdit(): void {
    console.log('I edit it!');//TODO: link the real Api when child creation will be fixed
  }

  onDelete(): void {
    console.log('I delete it!'); //TODO: link the real Api when child creation will be fixed
  }
}
