import { InvokeFunctionExpr } from '@angular/compiler';
import { Component, Input} from '@angular/core';

@Component({
  selector: 'app-validation-hint-for-input',
  templateUrl: './validation-hint-for-input.component.html',
  styleUrls: ['./validation-hint-for-input.component.scss']
})
export class ValidationHintForInputComponent {
  @Input() type: string;
  @Input() invalid: boolean;
  @Input() isEmailCheck: boolean;
  @Input() isEmptyCheck: boolean;
  @Input() minLength: boolean;
  @Input() minCharachters: number;
  @Input() forbiddenCharacter: string;

  constructor () { }
}
