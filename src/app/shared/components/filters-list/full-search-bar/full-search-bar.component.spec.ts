import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';

import { TranslateModule } from '@ngx-translate/core';
import { ValidationHintComponent } from 'shared/components/validation-hint/validation-hint.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { timer } from 'rxjs';
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

  it('should change matToolTip text', () => {
    component.validationHint.nativeElement.textContent = 'Validation hint';
    component.tooltipText = '';

    component.ngAfterViewInit();

    component.validationHint.nativeElement.textContent = 'Text changed';

    timer(0).subscribe(() => {
      expect(component.tooltipText).toBe('Text changed');
    });
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
