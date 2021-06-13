import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParentInfoComponent } from './parent-info.component';
import { NgxsModule, Store } from '@ngxs/store';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, Input } from '@angular/core';
import { Child } from '../../../../shared/models/child.model';

describe('ParentInfoComponent', () => {
  let component: ParentInfoComponent;
  let fixture: ComponentFixture<ParentInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        RouterTestingModule
      ],
      declarations: [
        ParentInfoComponent,
        MockParentChildCardComponent
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

@Component({
  selector: 'app-child-card',
  template: ''
})
class MockParentChildCardComponent {
  @Input() child: Child;
}
