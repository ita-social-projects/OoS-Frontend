import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';

import { User } from 'shared/models/user.model';
import { Workshop } from 'shared/models/workshop.model';
import { ActionsComponent } from './actions.component';

describe('ActionsComponent', () => {
  let component: ActionsComponent;
  let fixture: ComponentFixture<ActionsComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, RouterTestingModule, MatIconModule, NgxsModule.forRoot([]), TranslateModule.forRoot()],
      declarations: [ActionsComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
    jest.spyOn(store, 'selectSnapshot').mockReturnValue(() => of({ role: '' } as User));
    fixture = TestBed.createComponent(ActionsComponent);
    component = fixture.componentInstance;
    component.workshop = {} as Workshop;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
