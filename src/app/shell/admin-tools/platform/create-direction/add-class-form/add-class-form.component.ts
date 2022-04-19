import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {  FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-class-form',
  templateUrl: './add-class-form.component.html',
  styleUrls: ['./add-class-form.component.scss']
})
export class AddClassFormComponent {

  @Input() ClassFormGroup: FormGroup;
  @Input() indexClass: number;
  @Input() classAmount: number;
  @Output() deleteForm = new EventEmitter();

  constructor() { }

   onDelete(): void {
    this.deleteForm.emit(this.indexClass);
  }
}


