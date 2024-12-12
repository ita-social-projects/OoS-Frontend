// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MatAutocompleteModule } from '@angular/material/autocomplete';
// import { MatIconModule } from '@angular/material/icon';
// import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
// import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { RouterTestingModule } from '@angular/router/testing';
// import { TranslateModule } from '@ngx-translate/core';
// import { NgxsModule } from '@ngxs/store';

// import { SearchbarComponent } from './searchbar.component';

// describe('SearchbarComponent', () => {
//   let component: SearchbarComponent;
//   let fixture: ComponentFixture<SearchbarComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [
//         MatIconModule,
//         MatFormFieldModule,
//         ReactiveFormsModule,
//         FormsModule,
//         MatInputModule,
//         BrowserAnimationsModule,
//         NgxsModule.forRoot([]),
//         RouterTestingModule,
//         MatAutocompleteModule,
//         TranslateModule.forRoot()
//       ],
//       declarations: [SearchbarComponent]
//     }).compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(SearchbarComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should call "performSearch" and "saveSearchResult" with "onValueEnter"', () => {
//     const performSearchSpy = jest.spyOn(component as any, 'performSearch');
//     const saveSearchResultsSpy = jest.spyOn(component as any, 'saveSearchResults');

//     component.onValueEnter();

//     expect(performSearchSpy).toHaveBeenCalled();
//     expect(saveSearchResultsSpy).toHaveBeenCalled();
//   });

//   it('should call "performSearch" with "onValueSelected"', () => {
//     const performSearchSpy = jest.spyOn(component as any, 'performSearch');

//     component.onValueSelect();

//     expect(performSearchSpy).toHaveBeenCalled();
//   });

//   it('should replace invalid characters and update the FormControl value', () => {
//     jest.spyOn(component.searchValueFormControl, 'setValue');
//     jest.spyOn(component.invalidCharacterDetected, 'emit');

//     const inputValue = 'Test@Value#123';
//     const expectedValue = 'TestValue123';

//     component.handleInvalidCharacter(inputValue);

//     expect(component.searchValueFormControl.setValue).toHaveBeenCalledWith(expectedValue);
//     expect(component.invalidCharacterDetected.emit).toHaveBeenCalled();
//   });
// });
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

  it('should call "performSearch" and "saveSearchResults" with "onValueEnter"', () => {
    const performSearchSpy = jest.spyOn(component as any, 'performSearch');
    const saveSearchResultsSpy = jest.spyOn(component as any, 'saveSearchResults');

    component.onValueEnter();

    expect(performSearchSpy).toHaveBeenCalled();
    expect(saveSearchResultsSpy).toHaveBeenCalled();
  });

  it('should call "performSearch" with "onValueSelect"', () => {
    const performSearchSpy = jest.spyOn(component as any, 'performSearch');

    component.onValueSelect();

    expect(performSearchSpy).toHaveBeenCalled();
  });

  it('should replace invalid characters and update the FormControl value', () => {
    const setValueSpy = jest.spyOn((component as any).searchValueFormControl, 'setValue');
    const invalidCharacterDetectedSpy = jest.spyOn(component.invalidCharacterDetected, 'emit');

    const inputValue = 'Test@Value#123';
    const expectedValue = 'TestValue123';

    component.handleInvalidCharacter(inputValue);

    expect(setValueSpy).toHaveBeenCalledWith(expectedValue);
    expect(invalidCharacterDetectedSpy).toHaveBeenCalled();
  });

  it('should filter previous results based on input value', () => {
    const inputValue = 'Test';
    (component as any).previousResults = ['Test1', 'Test2', 'Sample'];
    (component as any).filter(inputValue);

    expect(component.filteredResults).toEqual(['Test1', 'Test2']);
  });

  it('should save search results to localStorage when onValueEnter is called', () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
    const previousResults = (component as any).previousResults;

    (component as any).searchedText = 'Test search';
    (component as any).saveSearchResults();

    expect(setItemSpy).toHaveBeenCalledWith('previousResults', JSON.stringify([(component as any).searchedText, ...previousResults]));
  });

  it('should delete previous search value when onDeletePreviousSearchValue is called', () => {
    const removeItemSpy = jest.spyOn(Storage.prototype, 'setItem');
    (component as any).previousResults = ['Test1', 'Test2'];

    component.onDeletePreviousSearchValue('Test1', new MouseEvent('click'));

    expect((component as any).previousResults).toEqual(['Test2']);
    expect(removeItemSpy).toHaveBeenCalledWith('previousResults', JSON.stringify(['Test2']));
  });
});
