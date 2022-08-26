import { Input, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Constants } from '../../../../../shared/constants/constants';
import { Gender } from 'src/app/shared/enum/gender';
import { Child } from 'src/app/shared/models/child.model';
@Component({
  selector: 'app-person-card',
  templateUrl: './person-card.component.html',
  styleUrls: ['./person-card.component.scss'],
})
export class PersonCardComponent implements OnInit {
  readonly phonePrefix = Constants.PHONE_PREFIX;
  readonly dateFormat = Constants.SHORT_DATE_FORMAT;
  readonly gender = Gender;

  @Input() child: Child;

  editLink: string;

  constructor() {}

  ngOnInit(): void {
    this.editLink = this.child.isParent ? '/personal-cabinet/config/edit' : '/create-child';
  }
}
