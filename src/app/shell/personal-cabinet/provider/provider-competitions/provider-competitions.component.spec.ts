import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { NgxsModule, Store } from '@ngxs/store';
import { TranslateModule } from '@ngx-translate/core';
import { PushNavPath } from 'shared/store/navigation.actions';
import { PaginationConstants } from 'shared/constants/constants';
import { Provider } from 'shared/models/provider.model';
import { Role } from 'shared/enum/role';
import { CompetitionProviderViewCard } from 'shared/models/competition.model';
import { ProviderState } from 'shared/store/provider.state';
import { ProviderCompetitionsComponent } from './provider-competitions.component';

describe('ProviderCompetitionsComponent', () => {
  let component: ProviderCompetitionsComponent;
  let fixture: ComponentFixture<ProviderCompetitionsComponent>;
  let matDialogMock: any;
  let store: any;
  const mockData = {
    entities: [{ id: '1' } as CompetitionProviderViewCard, { id: '2' } as CompetitionProviderViewCard],
    totalAmount: 2
  };

  beforeEach(() => {
    matDialogMock = {
      open: jest.fn().mockReturnValue({
        afterClose: () => of(true)
      })
    };

    TestBed.configureTestingModule({
      declarations: [ProviderCompetitionsComponent],
      providers: [
        {
          provide: MatDialog,
          useValue: matDialogMock
        }
      ],
      imports: [TranslateModule.forRoot(), NgxsModule.forRoot([ProviderState]), HttpClientTestingModule]
    }).compileComponents();

    store = TestBed.inject(Store);
    jest.spyOn(store, 'select').mockReturnValue(of(mockData));

    fixture = TestBed.createComponent(ProviderCompetitionsComponent);
    component = fixture.componentInstance;
    component.provider = { providerId: '123' } as unknown as Provider;
    component.role = Role.provider;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initProviderData correctly', () => {
    const getSpy = jest.spyOn(component as any, 'getProviderCompetitions');
    component.initProviderData();
    expect(getSpy).toHaveBeenCalled();
    expect(component.competitions).toEqual(mockData);
  });

  it('should set navigation path', () => {
    jest.spyOn(store, 'dispatch');
    component.addNavPath();

    expect(store.dispatch).toHaveBeenCalledWith(
      new PushNavPath({
        name: expect.any(String),
        isActive: false,
        disable: true
      })
    );
  });

  it('should change page and fetch competitions', () => {
    const page = { element: 2, isActive: false };

    component.onPageChange(page);

    expect(component.currentPage).toBe(page);
  });

  it('should change items per page and reset to first page', () => {
    component.onItemsPerPageChange(20);

    expect(component.competitionCardParameters.size).toBe(20);

    expect(component.currentPage).toBe(PaginationConstants.firstPage);
  });
});
