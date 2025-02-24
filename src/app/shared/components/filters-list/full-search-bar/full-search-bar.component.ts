import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidationConstants } from 'shared/constants/validation';

@Component({
  selector: 'app-full-search-bar',
  templateUrl: './full-search-bar.component.html',
  styleUrls: ['./full-search-bar.component.scss']
})
export class FullSearchBarComponent {
  @Input() public styleClass: string;
  public displayErrorFormControl: FormControl = new FormControl();

  public readonly validationConstants = ValidationConstants;

  public setErrorFormControl(searchBarFormControl: FormControl): void {
    this.displayErrorFormControl = searchBarFormControl;
  }
}
