import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';

import { Application } from 'shared/models/application.model';
import { TextSliceTransformPipe } from 'shared/pipes/text-slice-transform.pipe';
import { InfoStatusComponent } from './info-status.component';
import { UserWorkshopService } from 'shared/services/workshops/user-workshop/user-workshop.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('InfoStatusComponent', () => {
  let component: InfoStatusComponent;
  let fixture: ComponentFixture<InfoStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([]), MatMenuModule, MatCardModule, MatDialogModule, MatIconModule, TranslateModule.forRoot(), HttpClientTestingModule],
      declarations: [InfoStatusComponent, TextSliceTransformPipe]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoStatusComponent);
    component = fixture.componentInstance;
    component.application = {} as Application;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
