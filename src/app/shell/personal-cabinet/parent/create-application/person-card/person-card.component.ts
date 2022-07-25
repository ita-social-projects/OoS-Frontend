import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { cardType } from '../../../../../shared/enum/role';
import { Constants } from '../../../../../shared/constants/constants';
@Component({
  selector: 'app-person-card',
  templateUrl: './person-card.component.html',
  styleUrls: ['./person-card.component.scss']
})
export class PersonCardComponent implements OnInit {
  readonly constants: typeof Constants = Constants;
  readonly CardType: typeof cardType = cardType;
  readonly phonePrefix = Constants.PHONE_PREFIX;
  UserFormGroup: FormGroup;

  @Input() card;
  @Input() cardType: cardType;

  constructor(private fb: FormBuilder) {
    this.UserFormGroup = this.fb.group({
      birthDay: new FormControl('', Validators.required),
      gender: new FormControl(''),
      socialGroupId: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
  }
}
