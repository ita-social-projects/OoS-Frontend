import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { of } from 'rxjs';
import { SetSearchQueryValue, AddPreviousResult, RemovePreviousResult } from 'shared/store/filter.actions';
import { TranslateService } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { WorkshopSearchbarComponent } from './workshop-searchbar.component';

describe('WorkshopSearchbarComponent', () => {
  let component: WorkshopSearchbarComponent;
  let fixture: ComponentFixture<WorkshopSearchbarComponent>;
  let mockRouter: Partial<Router>;
  let mockStore: Partial<Store>;
  let mockTranslateService: Partial<TranslateService>;

  beforeEach(async () => {
    mockRouter = {
      navigate: jest.fn()
    };

    mockStore = {
      dispatch: jest.fn(),
      selectSnapshot: jest.fn()
    };

    mockTranslateService = {
      get: jest.fn().mockReturnValue(of('translated value')),
      instant: jest.fn().mockReturnValue('translated value')
    };

    await TestBed.configureTestingModule({
      declarations: [WorkshopSearchbarComponent],
      imports: [ReactiveFormsModule, TranslateModule.forRoot(), MatAutocompleteModule, MatInputModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: Store, useValue: mockStore },
        { provide: TranslateService, useValue: mockTranslateService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkshopSearchbarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch SetSearchQueryValue on performSearch', () => {
    component.searchValueFormControl.setValue('SearchValue');
    (component as any).tempSearchValue = 'SearchValue';

    jest.spyOn(component, 'handleInvalidCharacter').mockReturnValue('SearchValue');

    (component as any).performSearch();
    expect(mockStore.dispatch).toHaveBeenCalledWith(new SetSearchQueryValue('SearchValue'));
  });

  it('should save search results by dispatching AddPreviousResult', () => {
    component.searchValueFormControl.setValue('NewSearch');
    (component as any).tempSearchValue = 'NewSearch';

    jest.spyOn(component, 'handleInvalidCharacter').mockReturnValue('NewSearch');

    (component as any).performSearch();
    expect(mockStore.dispatch).toHaveBeenCalledWith(new AddPreviousResult('NewSearch'));
  });

  it('should remove previous search value when onDeletePreviousSearchValue is called', () => {
    const event = new Event('click');
    jest.spyOn(event, 'stopPropagation');

    component.filteredResults = ['OldSearch'];
    component.onDeletePreviousSearchValue('OldSearch', event);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(component.filteredResults).toEqual([]);
    expect(mockStore.dispatch).toHaveBeenCalledWith(new RemovePreviousResult('OldSearch'));
  });
});
