import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'input[type=number]'
})
export class NumberArrowsDirective implements AfterViewInit, OnDestroy {
  @Input() public useArrows: boolean = true;
  private upInterval: number;
  private downInterval: number;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  public ngAfterViewInit(): void {
    if (this.useArrows) {
      const input = this.el.nativeElement;

      this.renderer.setStyle(input, 'padding-right', '24px');

      const width = `${parseFloat(getComputedStyle(input).width) + 20}px`;

      this.renderer.setStyle(input, 'width', width);

      const wrapper = this.renderer.createElement('div');
      this.renderer.setStyle(wrapper, 'position', 'relative');
      this.renderer.setStyle(wrapper, 'display', 'inline-block');
      this.renderer.setStyle(wrapper, 'width', width);

      const parent = input.parentNode;
      this.renderer.insertBefore(parent, wrapper, input);
      this.renderer.appendChild(wrapper, input);

      const up = this.createIcon('keyboard_arrow_up');
      const down = this.createIcon('keyboard_arrow_down');

      this.renderer.appendChild(wrapper, up);
      this.renderer.appendChild(wrapper, down);

      this.initBehavior(input, up, down, wrapper);
    }
  }

  public ngOnDestroy(): void {
    clearInterval(this.upInterval);
    clearInterval(this.downInterval);
  }

  private initBehavior(input: HTMLInputElement, up: HTMLElement, down: HTMLElement, wrapper: HTMLElement): void {
    // show on hover
    this.renderer.listen(wrapper, 'mouseenter', () => {
      if (!input.disabled) {
        this.renderer.setStyle(up, 'display', 'flex');
        this.renderer.setStyle(down, 'display', 'flex');
      }
    });

    this.renderer.listen(wrapper, 'mouseleave', () => {
      this.renderer.setStyle(up, 'display', 'none');
      this.renderer.setStyle(down, 'display', 'none');
    });

    // default + clamping
    this.renderer.listen(up, 'mousedown', () => {
      this.step(input, 'up');
      this.upInterval = setTimeout(() => (this.upInterval = setInterval(() => this.step(input, 'up'), 40)), 400);
    });
    this.renderer.listen(up, 'mouseup', () => clearInterval(this.upInterval));
    this.renderer.listen(up, 'mouseleave', () => clearInterval(this.upInterval));

    this.renderer.listen(down, 'mousedown', () => {
      this.step(input, 'down');
      this.downInterval = setTimeout(() => (this.downInterval = setInterval(() => this.step(input, 'down'), 40)), 400);
    });
    this.renderer.listen(down, 'mouseup', () => clearInterval(this.downInterval));
    this.renderer.listen(down, 'mouseleave', () => clearInterval(this.downInterval));
  }

  private createIcon(name: string): HTMLElement {
    const icon = this.renderer.createElement('mat-icon');
    this.renderer.setAttribute(icon, 'role', 'button');
    this.renderer.setStyle(icon, 'font-family', 'Material Icons');
    this.renderer.setStyle(icon, 'font-size', '18px');
    this.renderer.setStyle(icon, 'line-height', '18px');

    this.renderer.setStyle(icon, 'position', 'absolute');
    this.renderer.setStyle(icon, 'right', `${parseFloat(getComputedStyle(this.el.nativeElement).borderRadius) / 2}px`);
    this.renderer.setStyle(icon, name === 'keyboard_arrow_up' ? 'top' : 'bottom', '0');

    this.renderer.setStyle(icon, 'display', 'none');
    this.renderer.setStyle(icon, 'align-items', name === 'keyboard_arrow_up' ? 'flex-end' : 'flex-start');
    this.renderer.setStyle(icon, 'justify-content', 'center');

    this.renderer.setStyle(icon, 'cursor', 'pointer');
    this.renderer.setStyle(icon, 'user-select', 'none');
    this.renderer.setStyle(icon, 'background', 'transparent');
    this.renderer.setStyle(icon, 'color', 'white');

    this.renderer.setStyle(icon, 'width', '20px');
    this.renderer.setStyle(icon, 'height', '20px');
    this.renderer.setStyle(icon, 'padding', '0');

    const text = this.renderer.createText(name);
    this.renderer.appendChild(icon, text);

    return icon;
  }

  private step(input: HTMLInputElement, direction: 'up' | 'down'): void {
    if (input.disabled) {
      return;
    }

    const min = input.min !== '' ? Number(input.min) : -Infinity;
    const max = input.max !== '' ? Number(input.max) : Infinity;

    if (direction === 'up') {
      if (input.value === '' || Number(input.value) < max) {
        input.stepUp();
      }
    } else {
      if (input.value === '' || Number(input.value) > min) {
        input.stepDown();
      }
    }

    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }
}
