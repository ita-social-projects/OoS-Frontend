import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Constants } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-about-form',
  templateUrl: './about-form.component.html',
  styleUrls: ['./about-form.component.scss']
})
export class AboutFormComponent implements OnInit {

  readonly constants: typeof Constants = Constants;

  @Input() AboutFormGroup: FormGroup;
  @Input() index: number;
  @Input() aboutFormAmount: number;

  @Output() deleteForm = new EventEmitter();

  isActiveHeaderInfoButton = false;
  isActiveSectionInfoButton = false;

  constructor() { }

  ngOnInit(): void { }

  delete(): void {
    this.deleteForm.emit(this.index);
  }
}
