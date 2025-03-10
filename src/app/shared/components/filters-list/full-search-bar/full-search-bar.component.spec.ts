import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';

import { TranslateModule } from '@ngx-translate/core';
import { ValidationHintComponent } from 'shared/components/validation-hint/validation-hint.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FullSearchBarComponent } from './full-search-bar.component';

describe('FullSearchBarComponent', () => {
  let component: FullSearchBarComponent;
  let fixture: ComponentFixture<FullSearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatIconModule, TranslateModule.forRoot(), MatTooltipModule],
      declarations: [FullSearchBarComponent, MockCityFilterComponent, MockSearchBarComponent, ValidationHintComponent]
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
