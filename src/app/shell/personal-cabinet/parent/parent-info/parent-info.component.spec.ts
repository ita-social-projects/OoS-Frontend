import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParentInfoComponent } from './parent-info.component';
import { NgxsModule, Store } from '@ngxs/store';
import { MockStore } from '../../../../shared/mocks/mock-services';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';

describe('ParentInfoComponent', () => {
  let component: ParentInfoComponent;
  let fixture: ComponentFixture<ParentInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        RouterTestingModule
      ],
      providers: [
        { provide: Store, useValue: MockStore },
      ],
      declarations: [
        ParentInfoComponent
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


