import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';

import { TranslateModule } from '@ngx-translate/core';
import { FullSearchBarComponent } from './full-search-bar.component';

describe('FullSearchBarComponent', () => {
  let component: FullSearchBarComponent;
  let fixture: ComponentFixture<FullSearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatIconModule, TranslateModule.forRoot()],
      declarations: [FullSearchBarComponent, MockCityFilterComponent, MockSearchBarComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FullSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set `displayErrorFormControl` to false', () => {
    component.showErrorMessage();
    expect(component.displayErrorFormControl.value).toBe(false);
  });

  it('should set `displayErrorFormControl` to true', () => {
    component.hideErrorMessage();
    expect(component.displayErrorFormControl.value).toBe(true);
  });
});
@Component({
  selector: 'app-searchbar',
  template: ''
})
class MockSearchBarComponent {}
@Component({
  selector: 'app-city-filter',
  template: ''
})
class MockCityFilterComponent {}
