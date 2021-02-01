import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HobbyGroupsListComponent } from './hobby-groups-list.component';

describe('HobbyGroupsListComponent', () => {
  let component: HobbyGroupsListComponent;
  let fixture: ComponentFixture<HobbyGroupsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HobbyGroupsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HobbyGroupsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
