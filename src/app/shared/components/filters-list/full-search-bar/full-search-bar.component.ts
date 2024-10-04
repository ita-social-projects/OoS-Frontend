import { Component, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-full-search-bar',
  templateUrl: './full-search-bar.component.html',
  styleUrls: ['./full-search-bar.component.scss']
})
export class FullSearchBarComponent {
  @Input() public styleClass: string;
  public displayErrorFormControl: FormControl = new FormControl(true, Validators.requiredTrue);

  public showErrorMessage(): void {
    this.displayErrorFormControl.setValue(false);
  }

  public hideErrorMessage(): void {
    this.displayErrorFormControl.setValue(true);
  }
}
