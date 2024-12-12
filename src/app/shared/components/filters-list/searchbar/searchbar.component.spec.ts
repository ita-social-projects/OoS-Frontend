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

//   it('should call "performSearch" and "saveSearchResults" with "onValueEnter"', () => {
//     const performSearchSpy = jest.spyOn(component as any, 'performSearch');
//     const saveSearchResultsSpy = jest.spyOn(component as any, 'saveSearchResults');

//     component.onValueEnter();

//     expect(performSearchSpy).toHaveBeenCalled();
//     expect(saveSearchResultsSpy).toHaveBeenCalled();
//   });

//   it('should call "performSearch" with "onValueSelect"', () => {
//     const performSearchSpy = jest.spyOn(component as any, 'performSearch');

//     component.onValueSelect();

//     expect(performSearchSpy).toHaveBeenCalled();
//   });

//   it('should replace invalid characters and update the FormControl value', () => {
//     const setValueSpy = jest.spyOn((component as any).searchValueFormControl, 'setValue');
//     const invalidCharacterDetectedSpy = jest.spyOn(component.invalidCharacterDetected, 'emit');

//     const inputValue = 'Test@Value#123';
//     const expectedValue = 'TestValue123';

//     component.handleInvalidCharacter(inputValue);

//     expect(setValueSpy).toHaveBeenCalledWith(expectedValue);
//     expect(invalidCharacterDetectedSpy).toHaveBeenCalled();
//   });

//   it('should filter previous results based on input value', () => {
//     const inputValue = 'Test';
//     (component as any).previousResults = ['Test1', 'Test2', 'Sample'];
//     (component as any).filter(inputValue);

//     expect(component.filteredResults).toEqual(['Test1', 'Test2']);
//   });

//   it('should save search results to localStorage when onValueEnter is called', () => {
//     const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
//     const previousResults = (component as any).previousResults;

//     (component as any).searchedText = 'Test search';
//     (component as any).saveSearchResults();

//     expect(setItemSpy).toHaveBeenCalledWith('previousResults', JSON.stringify([(component as any).searchedText, ...previousResults]));
//   });

//   it('should delete previous search value when onDeletePreviousSearchValue is called', () => {
//     const removeItemSpy = jest.spyOn(Storage.prototype, 'setItem');
//     (component as any).previousResults = ['Test1', 'Test2'];

//     component.onDeletePreviousSearchValue('Test1', new MouseEvent('click'));

//     expect((component as any).previousResults).toEqual(['Test2']);
//     expect(removeItemSpy).toHaveBeenCalledWith('previousResults', JSON.stringify(['Test2']));
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
import { NgxsModule, Store } from '@ngxs/store';
import { of, Subject } from 'rxjs';

import { SearchbarComponent } from './searchbar.component';

class MockStore {
  dispatch = jest.fn();
  select = jest.fn().mockReturnValue(of([]));
}

describe('SearchbarComponent', () => {
  let component: SearchbarComponent;
  let fixture: ComponentFixture<SearchbarComponent>;
  let mockStore: MockStore;

  beforeEach(async () => {
    mockStore = new MockStore();

    await TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        BrowserAnimationsModule,
        NgxsModule.forRoot([], { developmentMode: true }),
        RouterTestingModule,
        MatAutocompleteModule,
        TranslateModule.forRoot()
      ],
      declarations: [SearchbarComponent],
      providers: [{ provide: Store, useValue: mockStore }]
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

    expect(setItemSpy).toHaveBeenCalledWith('previousResults', JSON.stringify(['Test search', ...previousResults]));
  });

  it('should delete previous search value when onDeletePreviousSearchValue is called', () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
    (component as any).previousResults = ['Test1', 'Test2'];

    const mockEvent = { stopPropagation: jest.fn() } as unknown as Event;
    component.onDeletePreviousSearchValue('Test1', mockEvent);

    expect((component as any).previousResults).toEqual(['Test2']);
    expect(setItemSpy).toHaveBeenCalledWith('previousResults', JSON.stringify(['Test2']));
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });

  it('should reset searchValueFormControl value on main page initialization', () => {
    const navigationPathsSubject = new Subject<any[]>();
    jest.spyOn(component as any, 'navigationPaths$', 'get').mockReturnValue(navigationPathsSubject.asObservable());
    (component as any).isResultPage = false;

    navigationPathsSubject.next([]);
    component.ngOnInit();

    expect(component.searchValueFormControl.value).toBe('');
  });

  it('should retain searchValueFormControl value on result page initialization', () => {
    const navigationPathsSubject = new Subject<any[]>();
    jest.spyOn(component as any, 'navigationPaths$', 'get').mockReturnValue(navigationPathsSubject.asObservable());
    (component as any).isResultPage = true;

    navigationPathsSubject.next([{ name: 'WorkshopResult' }]);
    component.ngOnInit();

    expect(component.searchValueFormControl.value).not.toBe('');
  });

  it('should emit validCharacterDetected when input has no invalid characters', () => {
    const validCharacterDetectedSpy = jest.spyOn(component.validCharacterDetected, 'emit');

    component.handleInvalidCharacter('ValidInput');

    expect(validCharacterDetectedSpy).toHaveBeenCalled();
  });
});
