import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupCommentsComponent } from './group-comments.component';

describe('GroupCommentsComponent', () => {
  let component: GroupCommentsComponent;
  let fixture: ComponentFixture<GroupCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupCommentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
