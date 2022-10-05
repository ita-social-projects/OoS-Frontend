import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ValidationConstants } from '../../constants/validation';

@Component({
  selector: 'app-info-form',
  templateUrl: './info-form.component.html',
  styleUrls: ['./info-form.component.scss']
})
export class InfoFormComponent {
  readonly validationConstants = ValidationConstants;

  @Input() InfoEditFormGroup: FormGroup;
  @Input() index: number;
  @Input() formAmount: number;
  @Input() maxDescriptionLength: number;

  @Output() deleteForm = new EventEmitter();

  constructor() { }

  onDelete(): void {
    this.deleteForm.emit(this.index);
  }
}
