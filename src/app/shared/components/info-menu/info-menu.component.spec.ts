import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';

import { InfoMenuComponent } from './info-menu.component';

describe('InfoIconComponent', () => {
  let component: InfoMenuComponent;
  let fixture: ComponentFixture<InfoMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InfoMenuComponent],
      imports: [MatMenuModule, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(InfoMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open menu after view init if @Input isOpen equal true', () => {
    component.isOpenByDefault = true;
    const openMenuSpy = jest.spyOn(MatMenuTrigger.prototype, 'openMenu');

    component.ngAfterViewInit();

    expect(openMenuSpy).toHaveBeenCalled();
  });

  it('should assign True to isOpened after onMenuOpened has been executed', () => {
    component.isOpened = false;

    component.onMenuOpened(true);

    expect(component.isOpened).toBe(true);
  });

  it('should assign False to isOpened and emit menuClosed after onMenuClosed has been executed', () => {
    component.isOpened = true;
    const menuClosedSpy = jest.spyOn(component.menuClosed, 'emit');

    component.onMenuClosed(false);

    expect(component.isOpened).toBe(false);
    expect(menuClosedSpy).toHaveBeenCalledWith(false);
  });
});
