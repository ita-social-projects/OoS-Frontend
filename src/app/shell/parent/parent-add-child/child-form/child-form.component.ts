import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-child-form',
  templateUrl: './child-form.component.html',
  styleUrls: ['./child-form.component.scss']
})
export class ChildFormComponent implements OnInit {
  
  constructor() { 
  }
  
  @Input() ChildFormGroup: FormGroup;
  @Input() index: number;
  @Input() childrenAmount: number;
  @Output() deleteForm = new EventEmitter();

  ngOnInit(): void {
    console.log(this.childrenAmount)
  }

  delete():void {
    this.deleteForm.emit(this.index);
  }

}
