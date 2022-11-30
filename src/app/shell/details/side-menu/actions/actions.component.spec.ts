import { Store, NgxsModule } from '@ngxs/store';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActionsComponent } from './actions.component';
import { Workshop } from '../../../../shared/models/workshop.model';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';
import { User } from '../../../../shared/models/user.model';
import {TranslateModule} from '@ngx-translate/core';

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
