import { AfterViewInit, Directive, ElementRef, HostListener, Inject, Renderer2, ViewContainerRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { asyncScheduler } from 'rxjs';
import { StretchCellComponent } from '../../components/stretch-cell/stretch-cell/stretch-cell.component';

@Directive({
  selector: '[appStretchTable]'
})
export class StretchTableDirective implements AfterViewInit {
  private selectedTh!: HTMLElement;
  private tableContainerWidth!: number;
  private maxWidth: number;
  private mouseMoveFunc!: (event: MouseEvent) => void;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private el: ElementRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {}

  @HostListener('window:resize', ['$event'])
  public onResize(): void {
    this.tableContainerWidth = (this.selectedTh.closest('.table-container') as HTMLElement).offsetWidth;
    this.maxWidth = this.getMaxWidth();
    (
      (Array.from(this.document.querySelectorAll('th')) as HTMLElement[]).filter(
        (th: HTMLElement) => getComputedStyle(th).position === 'sticky'
      ) as HTMLElement[]
    )
      .filter((th: HTMLElement) => th.offsetWidth >= this.maxWidth)
      .forEach((th: HTMLElement) => {
        this.renderer.setStyle(th, 'width', `${this.maxWidth}px`);
      });
  }

  @HostListener('mousedown', ['$event'])
  public onMouseDown(event: MouseEvent): void {
    if (!(event.target as HTMLElement).closest('.resize-border')) {
      return;
    }

    const body = this.document.querySelector('body');

    this.selectedTh = (event.target as HTMLElement).closest('th');
    this.maxWidth = this.getMaxWidth();
    this.mouseMoveFunc = this.changeWidth.bind(this);

    this.document.addEventListener('mouseup', this.onUpMouse.bind(this), { once: true });
    this.document.addEventListener('mousemove', this.mouseMoveFunc);

    this.renderer.setStyle(body, 'user-select', 'none');
    this.renderer.setStyle(body, 'pointer-events', 'none');
  }

  public ngAfterViewInit(): void {
    this.renderer.setStyle(this.el.nativeElement, 'visibility', 'hidden');
    asyncScheduler.schedule(() => this.addResizeStructure());
  }

  private onUpMouse(): void {
    this.document.removeEventListener('mousemove', this.mouseMoveFunc);
    const body = this.document.querySelector('body');
    body.style.userSelect = 'auto';
    body.style.pointerEvents = 'auto';
  }

  private changeWidth(event: MouseEvent): void {
    if (event.movementX === 0) {
      return;
    }

    if (this.selectedTh.offsetWidth > this.maxWidth) {
      this.selectedTh.style.width = `${this.maxWidth}px`;
      return;
    }

    if (this.selectedTh.offsetWidth + event.movementX > this.maxWidth) {
      return;
    }

    const cur = this.selectedTh.offsetWidth + event.movementX;
    this.selectedTh.style.width = `${cur}px`;
  }

  /**
   * This method inserts content with resize borders and changes width of actions to fit content
   */
  private addResizeStructure(): void {
    const THs = this.el.nativeElement.getElementsByTagName('th');
    this.tableContainerWidth = this.el.nativeElement.closest('.table-container').offsetWidth;

    for (let i = 0; i < THs.length - 1; i++) {
      const componentRef = this.viewContainerRef.createComponent(StretchCellComponent);
      const content = THs[i].childNodes[0];

      this.renderer.removeChild(THs[i], content);
      componentRef.instance.insertNode(content);

      this.renderer.appendChild(THs[i], componentRef.location.nativeElement);
    }

    const TDs = this.el.nativeElement.querySelector('tr td')?.parentElement.getElementsByTagName('td');

    for (let i = 0; i < THs.length; i++) {
      this.renderer.setStyle(THs[i], 'right', TDs[i].style.right);
      THs[i].style.width = `${THs[i].offsetWidth}px`;

      if (THs[i].classList.contains('mat-column-actions')) {
        const actionTd = TDs[i];
        const prevValH0 = THs[0].offsetWidth;
        const prevValHL = THs[i].offsetWidth;
        THs[i].style.width = `${actionTd.offsetWidth}px`; // th for actions has no content, and it's width won't be reduced to td's value
        const dif = Math.abs(prevValHL - THs[i].offsetWidth);
        THs[i].style.padding = getComputedStyle(actionTd).padding;

        THs[0].style.width = `${prevValH0 + dif}px`;
      }
    }

    this.el.nativeElement.style.visibility = 'visible';
  }

  /**
   * This method calculates max width of th with width of visible table container minus sum of width of all sticky columns ahead
   */
  private getMaxWidth(): number {
    this.tableContainerWidth = (this.selectedTh.closest('.table-container') as HTMLElement).offsetWidth;
    const row = this.selectedTh.closest('tr');

    if (!row) {
      return;
    }

    const allThs = Array.from(row.querySelectorAll('th')) as HTMLElement[];
    const selectedIndex = allThs.indexOf(this.selectedTh);

    const widthOfStickyElsAhead = allThs
      .slice(selectedIndex + 1)
      .filter((th: HTMLElement) => getComputedStyle(th).position === 'sticky')
      .reduce((sum, th: HTMLElement) => sum + th.offsetWidth, 0);

    return this.tableContainerWidth - widthOfStickyElsAhead;
  }
}
