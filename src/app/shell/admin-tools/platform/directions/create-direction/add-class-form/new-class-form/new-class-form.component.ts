import { FormGroup } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-new-class-form',
  templateUrl: './new-class-form.component.html',
  styleUrls: ['./new-class-form.component.scss']
})
export class NewClassFormComponent {
  @Input() classFormGroup: FormGroup;
  @Input() formIndex: number;
  @Input() classAmount;

  @Output() deleteForm = new EventEmitter();

  constructor() { }

  onDelete(): void {
    this.deleteForm.emit(this.formIndex);
  }

}
