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

import { SetSearchQueryValue, AddPreviousResult, RemovePreviousResult } from 'shared/store/filter.actions';
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
    jest.spyOn((component as any).searchValueFormControl, 'setValue');
    jest.spyOn(component.invalidCharacterDetected, 'emit');

    const inputValue = 'Test@Value-#123';
    const expectedValue = 'TestValue-123';

    component.handleInvalidCharacter(inputValue);

    expect(component.searchValueFormControl.setValue).toHaveBeenCalledWith(expectedValue, { emitEvent: false });
    expect(component.invalidCharacterDetected.emit).toHaveBeenCalled();
  });

  it('should emit invalidCharacterDetected if input contains invalid characters', () => {
    const invalidCharacterDetectedSpy = jest.spyOn(component.invalidCharacterDetected, 'emit');
    const setValueSpy = jest.spyOn(component.searchValueFormControl, 'setValue');

    component.handleInvalidCharacter('Invalid@Value');

    expect(setValueSpy).toHaveBeenCalledWith('InvalidValue', { emitEvent: false });
    expect(invalidCharacterDetectedSpy).toHaveBeenCalled();
  });

  it('should emit validCharacterDetected when input has no invalid characters', () => {
    const validCharacterDetectedSpy = jest.spyOn(component.validCharacterDetected, 'emit');

    component.handleInvalidCharacter('ValidInput');

    expect(validCharacterDetectedSpy).toHaveBeenCalled();
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

  it('should navigate to result page if not on result page during performSearch', () => {
    const navigateSpy = jest.spyOn((component as any).router, 'navigate');
    (component as any).isResultPage = false;
    component.searchValueFormControl.setValue('searchValue');
    (component as any).performSearch();

    expect(navigateSpy).toHaveBeenCalledWith(['result/List'], expect.anything());
  });

  it('should dispatch SetSearchQueryValue on performSearch', () => {
    (component as any).searchedText = 'SearchValue';
    (component as any).performSearch();

    expect(mockStore.dispatch).toHaveBeenCalledWith(new SetSearchQueryValue('SearchValue'));
  });

  it('should save search result by dispatching AddPreviousResult', () => {
    (component as any).searchedText = 'SearchValue';
    (component as any).saveSearchResults();

    expect(mockStore.dispatch).toHaveBeenCalledWith(new AddPreviousResult('SearchValue'));
  });

  it('should dispatch RemovePreviousResult when deleting a previous result', () => {
    const mockEvent = { stopPropagation: jest.fn() } as unknown as Event;

    component.onDeletePreviousSearchValue('Test1', mockEvent);

    expect(mockStore.dispatch).toHaveBeenCalledWith(new RemovePreviousResult('Test1'));
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });

  it('should not save duplicate search results in localStorage', () => {
    const mockResults = ['test search'];
    const duplicateSearch = 'Test Search';

    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify(mockResults));

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});

    (component as any).searchedText = duplicateSearch;
    (component as any).previousResults = mockResults;
    (component as any).saveSearchResults();

    expect(setItemSpy).not.toHaveBeenCalledWith('previousResults', JSON.stringify([duplicateSearch, ...mockResults]));
  });
});
