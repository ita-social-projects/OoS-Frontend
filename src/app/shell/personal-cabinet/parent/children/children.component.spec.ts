import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChildrenComponent } from './children.component';
import { NgxsModule, Store } from '@ngxs/store';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, Input } from '@angular/core';
import { Child } from '../../../../shared/models/child.model';
import { MatDialogModule } from '@angular/material/dialog';
import { Parent } from 'src/app/shared/models/parent.model';

describe('ParentInfoComponent', () => {
  let component: ChildrenComponent;
  let fixture: ComponentFixture<ChildrenComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        RouterTestingModule,
        MatDialogModule
      ],
      declarations: [
        ChildrenComponent,
        MockParentChildCardComponent
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(Store);
    spyOn(store, 'selectSnapshot').and.returnValue({ id: 1 } as Parent);
    fixture = TestBed.createComponent(ChildrenComponent);
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
