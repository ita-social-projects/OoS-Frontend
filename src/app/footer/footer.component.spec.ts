import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule, Store } from '@ngxs/store';

import { ClearMessageBar, ShowMessageBar } from 'shared/store/app.actions';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatSnackBarModule, NgxsModule.forRoot([]), TranslateModule.forRoot()],
      declarations: [FooterComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call showSnackBar method', () => {
    jest.spyOn(component, 'showSnackBar');

    store.dispatch([new ShowMessageBar({ message: 'test', type: 'success' }), new ClearMessageBar()]);

    expect(component.showSnackBar).toHaveBeenCalled();
  });
});
