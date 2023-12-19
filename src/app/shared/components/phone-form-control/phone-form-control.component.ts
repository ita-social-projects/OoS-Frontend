import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';

@Component({
  selector: 'app-phone-form-control',
  templateUrl: './phone-form-control.component.html',
  styleUrls: ['./phone-form-control.component.scss']
})
export class PhoneFormControlComponent implements AfterViewInit {
  @ViewChild(NgxMatIntlTelInputComponent) private inputComponent: NgxMatIntlTelInputComponent;
  @Input() public parentFormControl: FormControl;

  public ngAfterViewInit(): void {
    this.inputComponent.allCountries = this.inputComponent.allCountries.filter((country) => country.iso2 !== 'ru');
  }
}
