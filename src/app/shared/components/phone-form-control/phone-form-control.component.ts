import { AfterViewInit, Component, HostListener, Input, OnDestroy, ViewChild } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';
import { Country } from 'ngx-mat-intl-tel-input/lib/model/country.model';
import { Subject, startWith, takeUntil } from 'rxjs';

@Component({
  selector: 'app-phone-form-control',
  templateUrl: './phone-form-control.component.html',
  styleUrls: ['./phone-form-control.component.scss']
})
export class PhoneFormControlComponent implements AfterViewInit, OnDestroy {
  @Input() public parentFormControl: AbstractControl;

  @ViewChild(NgxMatIntlTelInputComponent) private inputComponent: NgxMatIntlTelInputComponent;

  private countries: Country[];
  private destroy$: Subject<boolean> = new Subject<boolean>();

  public get parentControl(): FormControl {
    return this.parentFormControl as FormControl;
  }

  @HostListener('document:keypress')
  public handleKeyboardEvent(): void {
    const countrySearchElement = document.querySelector('.ngx-mat-tel-input-mat-menu-panel .country-search');
    if (countrySearchElement) {
      setTimeout(() => (countrySearchElement as HTMLElement).focus(), 200);
    }
  }

  public ngAfterViewInit(): void {
    this.inputComponent.allCountries = this.inputComponent.allCountries.filter((country) => country.iso2 !== 'ru');
    this.countries = [...this.inputComponent.allCountries];

    this.inputComponent.getCountry = (code: string): Country =>
      this.inputComponent.allCountries.find((country: Country) => country.iso2 === code.toLowerCase()) ||
      this.inputComponent.preferredCountriesInDropDown.find((country: Country) => country.iso2 === code.toLowerCase()) || {
        name: 'UN',
        iso2: 'UN',
        dialCode: '',
        priority: 0,
        areaCodes: undefined,
        flagClass: 'UN',
        placeHolder: ''
      };

    this.inputComponent.countryChanged
      .pipe(startWith({}), takeUntil(this.destroy$))
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
