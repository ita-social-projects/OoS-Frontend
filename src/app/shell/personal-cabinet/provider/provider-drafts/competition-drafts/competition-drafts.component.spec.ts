import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Actions, NgxsModule, Store } from '@ngxs/store';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { OnDraftSendForModerationSuccess } from 'shared/store/provider.actions';
import { SearchResponse } from 'shared/models/search.model';
import { ProviderState } from 'shared/store/provider.state';
import { Provider } from 'shared/models/provider.model';
import { Role } from 'shared/enum/role';
import { CompetitionDraftCard } from 'shared/models/competition.model';
import { CompetitionDraftsComponent } from './competition-drafts.component';

describe('CompetitionDraftsComponent', () => {
  let component: CompetitionDraftsComponent;
  let fixture: ComponentFixture<CompetitionDraftsComponent>;
  let actions$: Actions;
  let matDialog: MatDialog;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, NgxsModule.forRoot([]), MatDialogModule, TranslateModule.forRoot()],
      declarations: [CompetitionDraftsComponent],
      providers: [
        {
          provide: Actions,
          useValue: {
            pipe: jest.fn().mockReturnValue(of(new OnDraftSendForModerationSuccess()))
          }
        },
        {
          provide: MatDialog,
          useValue: {
            open: jest.fn()
          }
        }
      ]
    }).compileComponents();
    const initialState = {
      totalAmount: 2,
      entities: [{} as CompetitionDraftCard, {} as CompetitionDraftCard]
    } as SearchResponse<CompetitionDraftCard[]>;

    store = TestBed.inject(Store);
    actions$ = TestBed.inject(Actions);
    matDialog = TestBed.inject(MatDialog);

    jest.spyOn(store, 'select').mockImplementation((selector) => {
      // @ts-ignore
      if (selector === ProviderState.providerCompetitionDrafts) {
        return of(initialState);
      }
    });

    fixture = TestBed.createComponent(CompetitionDraftsComponent);
    component = fixture.componentInstance;
    component.provider = { id: '123' } as Provider;
    component.role = Role.provider;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
