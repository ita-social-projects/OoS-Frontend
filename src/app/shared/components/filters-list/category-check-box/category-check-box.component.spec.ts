import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxsModule } from '@ngxs/store';

import { CategoryCheckBoxComponent } from './category-check-box.component';

describe('CategoryCheckBoxComponent', () => {
  let component: CategoryCheckBoxComponent;
  let fixture: ComponentFixture<CategoryCheckBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TranslateModule.forRoot(), NgxsModule.forRoot([])],
      declarations: [CategoryCheckBoxComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryCheckBoxComponent);
    component = fixture.componentInstance;
    component.directionsSelected = {
      selectedDirectionIds: [],
      selectedSubdirectionIds: [],
      indeterminateDirectionIds: []
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call scrollToSelectedDirection in ngAfterViewInit when there are selected directions', () => {
    const spyScroll = jest.spyOn(component as any, 'scrollToSelectedDirection');

    component.directionsSelected = {
      selectedDirectionIds: [1],
      selectedSubdirectionIds: [],
      indeterminateDirectionIds: []
    };

    component.ngAfterViewInit();

    expect(spyScroll).toHaveBeenCalled();
  });

  it('should not call scrollToSelectedDirection in ngAfterViewInit when no selected directions', () => {
    const spyScroll = jest.spyOn(component as any, 'scrollToSelectedDirection');

    component.directionsSelected = {
      selectedDirectionIds: [],
      selectedSubdirectionIds: [],
      indeterminateDirectionIds: []
    };

    component.ngAfterViewInit();

    expect(spyScroll).not.toHaveBeenCalled();
  });

  it('should scroll to the checked direction item', fakeAsync(() => {
    const container = document.createElement('div');

    const makeItem = (checked: boolean, offsetTopValue: number) => {
      const item = document.createElement('div');
      const checkbox = document.createElement('div');
      if (checked) {
        checkbox.classList.add('mat-checkbox-checked');
      }
      item.appendChild(checkbox);

      Object.defineProperty(item, 'offsetTop', {
        get: () => offsetTopValue
      });

      return item;
    };

    const first = makeItem(false, 10);
    const second = makeItem(true, 150);
    container.appendChild(first);
    container.appendChild(second);

    const native = {
      children: container.children,
      scrollTop: 0
    } as any;

    (component as any).filterContainer = { nativeElement: native };

    (component as any).scrollToSelectedDirection();
    tick(500);

    expect(native.scrollTop).toBe(150);
  }));
});
