import { ComponentFixture, TestBed } from '@angular/core/testing';
import {WorkshopModalComponent} from './workshop-modal.component';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {NgxsModule, Store} from '@ngxs/store';

describe('WorkshopModalComponent', () => {
  let component: WorkshopModalComponent;
  let fixture: ComponentFixture<WorkshopModalComponent>;
  const model = {
    title: 'Modal title'
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[ NgxsModule.forRoot([])],
      providers: [Store, { provide: MAT_DIALOG_DATA, useValue: model }],
      declarations: [ WorkshopModalComponent ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
