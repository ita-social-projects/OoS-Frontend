import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParentCreateChildComponent } from './parent-create-child.component';
import { NgxsModule, Store } from '@ngxs/store';
import { MockStore } from '../../../../shared/mocks/mock-services';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Component, Input } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('ParentCreateChildComponent', () => {
  let component: ParentCreateChildComponent;
  let fixture: ComponentFixture<ParentCreateChildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        RouterTestingModule
      ],
      providers: [
        { provide: Store, useValue: MockStore },
      ],
      declarations: [
        ParentCreateChildComponent,
        MockChildFormComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentCreateChildComponent);
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
}
