import { ComponentFixture, TestBed } from '@angular/core/testing';
import {UnregisteredUserWarningModalComponent} from './unregistered-user-warning-modal.component';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {NgxsModule, Store} from '@ngxs/store';

describe('WorkshopModalComponent', () => {
  let component: UnregisteredUserWarningModalComponent;
  let fixture: ComponentFixture<UnregisteredUserWarningModalComponent>;
  const model = {
    title: 'Modal title'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[ NgxsModule.forRoot([])],
      providers: [Store, { provide: MAT_DIALOG_DATA, useValue: model }],
      declarations: [ UnregisteredUserWarningModalComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnregisteredUserWarningModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
