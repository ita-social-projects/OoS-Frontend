import { Application } from 'src/app/shared/models/application.model';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChildrenComponent } from './children.component';
import { NgxsModule } from '@ngxs/store';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, Input } from '@angular/core';
import { Child } from '../../../../shared/models/child.model';
import { MatDialogModule } from '@angular/material/dialog';
import { PaginationElement } from 'src/app/shared/models/paginationElement.model';

describe('ParentInfoComponent', () => {
  let component: ChildrenComponent;
  let fixture: ComponentFixture<ChildrenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        RouterTestingModule,
        MatDialogModule
      ],
      declarations: [
        ChildrenComponent,
        MockParentChildCardComponent,
        MockListChildCardPaginatorComponent
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
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
  @Input() applications: Application;
}


@Component({
  selector: 'app-paginator',
  template: ''
})
class MockListChildCardPaginatorComponent {
  @Input() totalEntities: number;
  @Input() currentPage: PaginationElement;
}
