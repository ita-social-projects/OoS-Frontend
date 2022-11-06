import { ComponentFixture, TestBed } from '@angular/core/testing';
import {UnregisteredUserModalComponent} from './unregistered-user-modal.component';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {NgxsModule, Store} from '@ngxs/store';

describe('WorkshopModalComponent', () => {
  let component: UnregisteredUserModalComponent;
  let fixture: ComponentFixture<UnregisteredUserModalComponent>;
  const model = {
    title: 'Modal title'
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[ NgxsModule.forRoot([])],
      providers: [Store, { provide: MAT_DIALOG_DATA, useValue: model }],
      declarations: [ UnregisteredUserModalComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnregisteredUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
