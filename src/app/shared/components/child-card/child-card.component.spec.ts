import { MatIconModule } from '@angular/material/icon';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChildCardComponent } from './child-card.component';
import { MatCardModule } from '@angular/material/card';
import { Child } from '../../models/child.model';
import { RouterTestingModule } from '@angular/router/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserModule } from '@angular/platform-browser';
import { NgxsModule } from '@ngxs/store';

describe('ChildCardComponent', () => {
  let component: ChildCardComponent;
  let fixture: ComponentFixture<ChildCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        MatCardModule,
        RouterTestingModule,
        NgxsModule.forRoot([]),
      ],
      declarations: [ChildCardComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildCardComponent);
    component = fixture.componentInstance;
    component.child = {} as Child;
    component.applications=[]
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
