import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule, State, Store } from '@ngxs/store';

import { Injectable } from '@angular/core';
import { Direction } from 'shared/models/category.model';
import { SetDirections } from 'shared/store/filter.actions';
import { MetaDataStateModel } from 'shared/store/meta-data.state';
import { CategoryCheckBoxComponent } from './category-check-box.component';

describe('CategoryCheckBoxComponent', () => {
  let component: CategoryCheckBoxComponent;
  let fixture: ComponentFixture<CategoryCheckBoxComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        MatFormFieldModule,
        NgxsModule.forRoot([MockMetaDataState]),
        ReactiveFormsModule,
        MatInputModule,
        MatCheckboxModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot()
      ],
      declarations: [CategoryCheckBoxComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryCheckBoxComponent);
    component = fixture.componentInstance;
    component.selectedDirectionIds = [1];
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter directions when directionSearchFormControl value changes', fakeAsync(() => {
    const mockSearchValue = 'direction3';

    component.directionSearchFormControl.setValue(mockSearchValue);
    tick(300);

    expect(component.filteredDirections).toEqual([mockDirections[2]]);
  }));

  it('should dispatch SetDirections and select direction id when onDirectionCheck called with checked', () => {
    jest.spyOn(store, 'dispatch');

    component.onDirectionCheck(mockDirections[0], { checked: true } as MatCheckboxChange);

    expect(component.selectedDirectionIds).toContainEqual(mockDirections[0].id);
    expect(store.dispatch).toHaveBeenCalledWith(new SetDirections(component.selectedDirectionIds));
  });

  it('should dispatch SetDirections and deselect direction id when onDirectionCheck called with not checked', () => {
    jest.spyOn(store, 'dispatch');

    component.onDirectionCheck(mockDirections[1], { checked: false } as MatCheckboxChange);

    expect(component.selectedDirectionIds.length).toBeFalsy();
    expect(store.dispatch).toHaveBeenCalledWith(new SetDirections(component.selectedDirectionIds));
  });
});

const mockDirections: Direction[] = [
  { id: 1, title: 'direction1', description: 'description1' },
  { id: 2, title: 'direction2', description: 'description2' },
  { id: 3, title: 'direction3', description: 'description3' }
];

@State<MetaDataStateModel>({
  name: 'metaDataState',
  defaults: {
    directions: mockDirections,
    socialGroups: [],
    institutionStatuses: [],
    providerTypes: [],
    achievementsTypes: [],
    rating: undefined,
    isLoading: false,
    featuresList: undefined,
    institutions: [],
    institutionFieldDesc: [],
    instituitionsHierarchyAll: [],
    instituitionsHierarchy: [],
    editInstituitionsHierarchy: [],
    codeficatorSearch: [],
    codeficator: undefined
  }
})
@Injectable()
class MockMetaDataState {}
