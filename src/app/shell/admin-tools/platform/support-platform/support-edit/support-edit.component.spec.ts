import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';

import { SupportEditComponent } from './support-edit.component';

describe('SupportEditComponent', () => {
  let component: SupportEditComponent;
  let fixture: ComponentFixture<SupportEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        RouterTestingModule
      ],
      declarations: [ 
        SupportEditComponent,
        MockSupportFormComponent
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'app-support-form',
  template: ''
})
class MockSupportFormComponent {
  @Input() SupportFormGroup: FormGroup;
  @Input() index: number;
  @Input() supportFormAmount: number;
}