import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateApplicationComponent } from './create-application.component';
import { NgxsModule, Store } from '@ngxs/store';
import { MockStore } from '../../../shared/mocks/mock-services';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CreateApplicationComponent', () => {
  let component: CreateApplicationComponent;
  let fixture: ComponentFixture<CreateApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        MatButtonToggleModule,
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        BrowserAnimationsModule
      ],
      declarations: [ CreateApplicationComponent ],
      providers: [
        { provide: Store, useValue: MockStore },
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateApplicationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
