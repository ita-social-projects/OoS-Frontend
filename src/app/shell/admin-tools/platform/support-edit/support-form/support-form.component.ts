import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Constants } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-support-form',
  templateUrl: './support-form.component.html',
  styleUrls: ['./support-form.component.scss']
})
export class SupportFormComponent implements OnInit {

  readonly constants: typeof Constants = Constants;

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
