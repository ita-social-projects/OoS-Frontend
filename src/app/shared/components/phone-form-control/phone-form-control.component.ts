import { AfterViewInit, Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';
import { Country } from 'ngx-mat-intl-tel-input/lib/model/country.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-phone-form-control',
  templateUrl: './phone-form-control.component.html',
  styleUrls: ['./phone-form-control.component.scss']
})
export class PhoneFormControlComponent implements AfterViewInit, OnDestroy {
  @ViewChild(NgxMatIntlTelInputComponent) private inputComponent: NgxMatIntlTelInputComponent;
  @Input() public parentFormControl: FormControl;

  private countries: Country[];
  private destroy$: Subject<boolean> = new Subject<boolean>();

  public ngAfterViewInit(): void {
    this.inputComponent.allCountries = this.inputComponent.allCountries.filter((country) => country.iso2 !== 'ru');
    this.countries = [...this.inputComponent.allCountries];

    this.inputComponent.getCountry = (code: string): Country =>
      this.inputComponent.allCountries.find((country) => country.iso2 === code.toLowerCase()) ||
      this.inputComponent.preferredCountriesInDropDown.find((country) => country.iso2 === code.toLowerCase()) || {
        name: 'UN',
        iso2: 'UN',
        dialCode: '',
        priority: 0,
        areaCodes: undefined,
        flagClass: 'UN',
        placeHolder: ''
      };

    this.inputComponent.countryChanged
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () =>
          (this.inputComponent.allCountries = this.countries.filter(
            (country) => !this.inputComponent.preferredCountriesInDropDown.includes(country)
          ))
      );
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
