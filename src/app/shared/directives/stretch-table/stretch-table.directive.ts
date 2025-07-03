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
  ) {
    this.el.nativeElement.style.visibility = 'hidden';
  }

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
        this.renderer.setStyle(th, 'width', this.maxWidth + 'px');
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
      this.selectedTh.style.width = this.maxWidth + 'px';
      return;
    }

    if (this.selectedTh.offsetWidth + event.movementX > this.maxWidth) {
      return;
    }

    const cur = this.selectedTh.offsetWidth + event.movementX;
    this.selectedTh.style.width = cur + 'px';
  }

  /**
   * This method inserts content with resize borders and changes width of actions to fit content
   */
  private addResizeStructure(): void {
    const THs = this.el.nativeElement.getElementsByTagName('th');

    for (let i = 0; i < THs.length - 1; i++) {
      const componentRef = this.viewContainerRef.createComponent(StretchCellComponent);
      const content = THs[i].childNodes[0];

      this.renderer.removeChild(THs[i], content);
      componentRef.instance.insertNode(content);

      this.renderer.appendChild(THs[i], componentRef.location.nativeElement);
    }

    for (let i = 0; i < THs.length; i++) {
      if (THs[i].classList.contains('mat-column-actions')) {
        const actionTd = this.document.querySelector('td.mat-column-actions') as HTMLElement;
        THs[i].style.width = actionTd.offsetWidth + 'px'; // th for actions has no content, and it's width won't be reduced to td's value
        THs[i].style.padding = getComputedStyle(actionTd).padding;

        THs[0].style.width = 'auto'; // to fill free space
      }
      THs[i].style.width = `${THs[i].offsetWidth}px`;
    }

    this.el.nativeElement.style.visibility = 'visible';
  }

  /**
   * This method calculates max width of th with width of visible table container minus sum of width of all sticky headers ahead
   */
  private getMaxWidth(): number {
    this.tableContainerWidth = (this.selectedTh.closest('.table-container') as HTMLElement).offsetWidth;
    const row = this.selectedTh.closest('tr');

    if (!row) {
      return;
    }

    const allThs = Array.from(row.querySelectorAll('th')) as HTMLElement[];
    const selectedIndex = allThs.indexOf(this.selectedTh);
    let widthOfStickyElsAhead = 0;

    allThs
      .slice(selectedIndex + 1)
      .filter((th: HTMLElement) => getComputedStyle(th).position === 'sticky')
      .forEach((th: HTMLElement) => {
        widthOfStickyElsAhead += th.offsetWidth;
      });

    return this.tableContainerWidth - widthOfStickyElsAhead;
  }
}
