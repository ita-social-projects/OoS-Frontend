import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ValidationConstants } from 'src/app/shared/constants/validation';

@Component({
  selector: 'app-about-form',
  templateUrl: './about-form.component.html',
  styleUrls: ['./about-form.component.scss']
})
export class AboutFormComponent implements OnInit {

  readonly validationConstants: typeof ValidationConstants = ValidationConstants;

  @Input() AboutItemFormGroup: FormGroup;
  @Input() index: number;
  @Input() aboutFormAmount: number;

  @Output() deleteForm = new EventEmitter();

  isActiveSectionInfoButton = false;

  constructor() { }

  ngOnInit(): void { }

  onDelete(): void {
    this.deleteForm.emit(this.index);
  }
}
