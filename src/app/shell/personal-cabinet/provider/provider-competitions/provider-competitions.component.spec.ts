import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { Store } from '@ngxs/store';
import { TranslateModule } from '@ngx-translate/core';
import { PushNavPath } from 'shared/store/navigation.actions';
import { PaginationConstants } from 'shared/constants/constants';
import { ProviderCompetitionsComponent } from './provider-competitions.component';

describe('ProviderCompetitionComponent', () => {
  let component: ProviderCompetitionsComponent;
  let fixture: ComponentFixture<ProviderCompetitionsComponent>;
  let storeMock: any;
  let matDialogMock: any;

  beforeEach(() => {
    storeMock = {
      dispatch: jest.fn(),
      select: jest.fn().mockReturnValue(of({ entities: [], totalAmount: 0 }))
    };

    matDialogMock = {
      open: jest.fn().mockReturnValue({
        afterClose: () => of(true)
      })
    };

    TestBed.configureTestingModule({
      declarations: [ProviderCompetitionsComponent],
      providers: [
        { provide: Store, useValue: storeMock },
        { provide: MatDialog, useValue: matDialogMock }
      ],
      imports: [TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProviderCompetitionsComponent);
    component = fixture.componentInstance;
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set navigation path', () => {
    component.addNavPath();

    expect(storeMock.dispatch).toHaveBeenCalledWith(
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
