import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidenavFiltersComponent } from './sidenav-filters.component';
import { NgxsModule } from '@ngxs/store';
import { Component, Input } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';

describe('SidenavFiltersComponent', () => {
  let component: SidenavFiltersComponent;
  let fixture: ComponentFixture<SidenavFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatSidenavModule, NgxsModule.forRoot([])],
      declarations: [SidenavFiltersComponent, MockFiltersListComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'app-filters-list',
  template: ''
})
class MockFiltersListComponent {
  @Input() isMobileView;
}
