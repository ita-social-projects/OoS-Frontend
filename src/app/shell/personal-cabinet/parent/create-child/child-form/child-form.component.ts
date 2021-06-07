import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-child-form',
  templateUrl: './child-form.component.html',
  styleUrls: ['./child-form.component.scss']
})
export class ChildFormComponent implements OnInit {

  @Input() ChildFormGroup: FormGroup;
  @Input() index: number;
  @Input() childrenAmount: number;
  @Output() deleteForm = new EventEmitter();

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
  }

  delete(): void {
    this.deleteForm.emit(this.index);
  }

}
