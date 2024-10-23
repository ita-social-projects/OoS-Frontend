import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';

import { DataItem } from 'shared/models/item.model';
import { CreateChildComponent } from './create-child.component';

describe('CreateChildComponent', () => {
  let component: CreateChildComponent;
  let fixture: ComponentFixture<CreateChildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        RouterTestingModule,
        HttpClientTestingModule,
        MatCheckboxModule,
        MatDialogModule
      ],
      declarations: [CreateChildComponent, MockChildFormComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
@Component({
  selector: 'app-child-form',
  template: ''
})
class MockChildFormComponent {
  @Input() ChildFormGroup: FormGroup;
  @Input() index: number;
  @Input() childrenAmount: number;
  @Input() socialGroups: DataItem[];
}
