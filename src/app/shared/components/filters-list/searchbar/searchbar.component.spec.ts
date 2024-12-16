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

  it('should call "performSearch" and "saveSearchResult" with "onValueEnter"', () => {
    const performSearchSpy = jest.spyOn(component as any, 'performSearch');
    const saveSearchResultsSpy = jest.spyOn(component as any, 'saveSearchResults');

    component.onValueEnter();

    expect(performSearchSpy).toHaveBeenCalled();
    expect(saveSearchResultsSpy).toHaveBeenCalled();
  });

  it('should call "performSearch" with "onValueSelected"', () => {
    const performSearchSpy = jest.spyOn(component as any, 'performSearch');

    component.onValueSelect();

    expect(performSearchSpy).toHaveBeenCalled();
  });

  it('should replace invalid characters and update the FormControl value', () => {
    jest.spyOn(component.searchValueFormControl, 'setValue');
    jest.spyOn(component.invalidCharacterDetected, 'emit');

    const inputValue = 'Test@Value#123';
    const expectedValue = 'TestValue123';

    component.handleInvalidCharacter(inputValue);

    expect(component.searchValueFormControl.setValue).toHaveBeenCalledWith(expectedValue);
    expect(component.invalidCharacterDetected.emit).toHaveBeenCalled();
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

  it('should save search results to localStorage when saveSearchResults is called', () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
    const previousResults = (component as any).previousResults;

    (component as any).searchedText = 'New Search';
    (component as any).saveSearchResults();

    expect(setItemSpy).toHaveBeenCalledWith('previousResults', JSON.stringify(['New Search', ...previousResults]));
  });

  it('should not remove any search when previousResults length is 9 or less', () => {
    const mockResults = Array(9).fill('OldSearch');
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce(JSON.stringify(mockResults));
    (component as any).searchedText = 'NewSearch';

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
    (component as any).saveSearchResults();

    expect((component as any).previousResults.length).toBe(10);
    expect((component as any).previousResults[0]).toBe('NewSearch');
    expect(setItemSpy).toHaveBeenCalledWith('previousResults', JSON.stringify((component as any).previousResults));
  });

  it('should handle empty localStorage for previousResults', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce(null);

    const results = (component as any).getPreviousResults();

    expect(results).toEqual([]);
    expect(localStorage.getItem('previousResults')).toEqual('[]');
  });

  it('should dispatch SetSearchQueryValue when performSearch is called', () => {
    component.searchValueFormControl.setValue('searchValue');
    const dispatchSpy = jest.spyOn(mockStore, 'dispatch');

    (component as any).performSearch();

    expect(dispatchSpy).toHaveBeenCalledWith(expect.anything());
  });

  it('should navigate to result page if not on result page during performSearch', () => {
    const navigateSpy = jest.spyOn((component as any).router, 'navigate');
    (component as any).isResultPage = false;
    component.searchValueFormControl.setValue('searchValue');

    (component as any).performSearch();

    expect(navigateSpy).toHaveBeenCalledWith(['result/List'], expect.anything());
  });
});
