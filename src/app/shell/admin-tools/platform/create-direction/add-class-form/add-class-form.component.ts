import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {  FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-class-form',
  templateUrl: './add-class-form.component.html',
  styleUrls: ['./add-class-form.component.scss']
})
export class AddClassFormComponent implements OnInit {

  @Input() ClassFormGroup: FormGroup;
  @Input() indexClass: number;
  @Input() classAmount: number;
  @Output() deleteForm = new EventEmitter();

  isActiveClassInfoButton = false;
  isActiveDepartmentInfoButton = false;
  isActiveDirectionInfoButton = false;

  constructor() { }

  ngOnInit(): void {
   }

   delete(): void {
    this.deleteForm.emit(this.indexClass);
  }

}


