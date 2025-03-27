import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxsModule } from '@ngxs/store';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { WorkshopInfoComponent } from './workshop-info.component';

describe('WorkshopInfoComponent', () => {
  let component: WorkshopInfoComponent;
  let fixture: ComponentFixture<WorkshopInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([]), RouterTestingModule, TranslateModule.forRoot()],
      declarations: [WorkshopInfoComponent]
    });
    fixture = TestBed.createComponent(WorkshopInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
