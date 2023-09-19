import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ValidationConstants } from '../../constants/validation';

@Component({
  selector: 'app-info-form',
  templateUrl: './info-form.component.html',
  styleUrls: ['./info-form.component.scss']
})
export class InfoFormComponent {
  public readonly validationConstants = ValidationConstants;

  @Input() public InfoEditFormGroup: FormGroup;
  @Input() public index: number;
  @Input() public formAmount: number;
  @Input() public maxDescriptionLength: number;

  @Output() public deleteForm = new EventEmitter();

  constructor() {}

  public onDelete(): void {
    this.deleteForm.emit(this.index);
  }
}
