import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';

import { SearchbarComponent } from './searchbar.component';

describe('SearchbarComponent', () => {
  let component: SearchbarComponent;
  let fixture: ComponentFixture<SearchbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        BrowserAnimationsModule,
        NgxsModule.forRoot([]),
        RouterTestingModule,
        MatAutocompleteModule,
        TranslateModule.forRoot()
      ],
      declarations: [SearchbarComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call "performSearch" and "saveSearchResult" with "onValueEnter"', () => {
    const performSearchSpy = jest.spyOn(component, 'performSearch');
    const saveSearchResultsSpy = jest.spyOn(component, 'saveSearchResults');

    component.onValueEnter();

    expect(performSearchSpy).toHaveBeenCalled();
    expect(saveSearchResultsSpy).toHaveBeenCalled();
  });

  it('should call "performSearch" with "onValueSelected"', () => {
    const performSearchSpy = jest.spyOn(component, 'performSearch');

    component.onValueSelect();

    expect(performSearchSpy).toHaveBeenCalled();
  });

  it('should replace invalid characters and update the FormControl value', () => {
    jest.spyOn(component.searchValueFormControl, 'setValue');
    jest.spyOn(component.invalidCharacterDetected, 'emit');

    const inputValue = 'Test@Value-#123';
    const expectedValue = 'TestValue-123';

    component.handleInvalidCharacter(inputValue);

    expect(component.searchValueFormControl.setValue).toHaveBeenCalledWith(expectedValue, { emitEvent: false });
    expect(component.invalidCharacterDetected.emit).toHaveBeenCalled();
  });
});
