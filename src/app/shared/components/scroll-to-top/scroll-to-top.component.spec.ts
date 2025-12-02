import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgxsModule } from '@ngxs/store';
import { ScrollToTopComponent } from './scroll-to-top.component';

describe('ScrollToTopComponent', () => {
  let component: ScrollToTopComponent;
  let fixture: ComponentFixture<ScrollToTopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatIconModule, MatButtonModule, NgxsModule.forRoot([])],
      declarations: [ScrollToTopComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrollToTopComponent);
    const footer = document.createElement('app-footer');
    document.body.appendChild(footer);
    Object.defineProperty(footer, 'clientHeight', { value: 160 });
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 1000 });
    (window as any).ResizeObserver = class {
      observe() {}

      disconnect() {}
    };
    component = fixture.componentInstance;
    component.footerHeight = footer.clientHeight;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should scroll to top by click', () => {
    const scrollToSpy = jest.spyOn(window, 'scrollTo').mockImplementation(() => {});
    component.scrollToTop();
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    scrollToSpy.mockRestore();
  });

  it('should show button scroll if scroll is greater or equal than scroll show constraint', () => {
    Object.defineProperty(window, 'scrollY', { value: 200 });
    component.onScroll();
    expect(component.showScroll).toBe(true);
  });

  it('should hide button if scroll is less than scroll show constraint', () => {
    Object.defineProperty(window, 'scrollY', { value: 199 });
    component.onScroll();
    expect(component.showScroll).toBe(false);
  });

  it('should be sticky when scroll is over the footer', () => {
    Object.defineProperty(window, 'scrollY', { value: 200 });
    Object.defineProperty(window, 'innerHeight', { value: 300 });
    component.onScroll();
    expect(component.shouldBeSticky).toBe(true);
  });

  it('should be static when scroll is over the footer', () => {
    Object.defineProperty(window, 'scrollY', { value: 440 });
    Object.defineProperty(window, 'innerHeight', { value: 400 });
    component.onScroll();
    expect(component.shouldBeSticky).toBe(false);
  });

  it('should set small screen after resize', () => {
    Object.defineProperty(window, 'innerWidth', { value: 800 });
    component.isSmallScreen = false;
    component.onResize();
    expect(component.isSmallScreen).toBe(true);
  });
});
