import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { Direction } from 'src/app/shared/models/category.model';
import { PlatformComponent } from './platform.component';

describe('PlatformComponent', () => {
  let component: PlatformComponent;
  let fixture: ComponentFixture<PlatformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        RouterTestingModule,
        MatTabsModule,
        MatIconModule,
        MatButtonModule,
        NoopAnimationsModule
      ],
      declarations: [ 
        PlatformComponent,
        MockAllCategoriesCardComponent,
        MockAllCategoriesSearchbarComponent
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlatformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
@Component({
  selector: 'app-category-card',
  template: ''
})
class MockAllCategoriesCardComponent {
  @Input() direction: Direction;
  @Input() isEditMode: boolean;
}

@Component({
  selector: 'app-full-search-bar',
  template: ''
})
class MockAllCategoriesSearchbarComponent {}
