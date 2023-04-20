import { MatIconModule } from '@angular/material/icon';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChildCardComponent } from './child-card.component';
import { MatCardModule } from '@angular/material/card';
import { Child } from '../../../../../shared/models/child.model';
import { RouterTestingModule } from '@angular/router/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { NgxsModule } from '@ngxs/store';
import { TranslateCasesPipe } from '../../../../../shared/pipes/translate-cases.pipe';
import { TranslateModule } from '@ngx-translate/core';

describe('ChildCardComponent', () => {
  let component: ChildCardComponent;
  let fixture: ComponentFixture<ChildCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        MatCardModule,
        MatTooltipModule,
        RouterTestingModule,
        NgxsModule.forRoot([]),
        TranslateModule.forRoot(),
      ],
      declarations: [ChildCardComponent, TranslateCasesPipe],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildCardComponent);
    component = fixture.componentInstance;
    component.child = {} as Child;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
