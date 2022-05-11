import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ValidationConstants } from 'src/app/shared/constants/validation';

@Component({
  selector: 'app-support-form',
  templateUrl: './support-form.component.html',
  styleUrls: ['./support-form.component.scss']
})
export class SupportFormComponent implements OnInit {

  readonly validationConstants: typeof ValidationConstants = ValidationConstants;

  @Input() SupportFormGroup: FormGroup;
  @Input() index: number;
  @Input() supportFormAmount: number;
  
  isActiveHeaderInfoButton = false;
  isActiveSectionInfoButton = false;

  @Output() deleteForm = new EventEmitter();

  constructor() { }

  ngOnInit(): void { }

  delete(): void {
    this.deleteForm.emit(this.index);
  }

}
