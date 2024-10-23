import { Component, Input, OnInit } from '@angular/core';

import { Constants } from 'shared/constants/constants';
import { Gender } from 'shared/enum/enumUA/gender';
import { Child } from 'shared/models/child.model';

@Component({
  selector: 'app-person-card',
  templateUrl: './person-card.component.html',
  styleUrls: ['./person-card.component.scss']
})
export class PersonCardComponent implements OnInit {
  @Input() public child: Child;

  public readonly dateFormat = Constants.SHORT_DATE_FORMAT;
  public readonly gender = Gender;

  public editLink: string;

  constructor() {}

  public ngOnInit(): void {
    this.editLink = this.child.isParent ? '/personal-cabinet/config/edit' : `/create-child/${this.child.id}`;
  }
}
