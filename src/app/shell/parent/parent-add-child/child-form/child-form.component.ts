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
  @Input() ChildrFormGroup: FormGroup;
  @Input() index: number;
  @Output() deleteForm = new EventEmitter();

  ngOnInit(): void {

  }
  delete():void {
    
    this.ChildrFormGroup.reset();
    this.deleteForm.emit(this.index);
  }

}
