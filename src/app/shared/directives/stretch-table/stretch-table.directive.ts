import { AfterViewInit, Directive, ElementRef, HostListener, Inject, Renderer2, ViewContainerRef } from '@angular/core';
import { StretchCellComponent } from '../../components/stretch-cell/stretch-cell/stretch-cell.component';
import { DOCUMENT } from '@angular/common';
import { ResizeEvent } from 'leaflet';

@Directive({
  selector: '[appStretchTable]'
})
export class StretchTableDirective implements AfterViewInit {
  private selectedTh!: HTMLElement;
  private tableContainerWidth!: number;
  private minWidth: number = 50;
  private maxWidth: number;
  private mouseMoveFunc!: (event: MouseEvent) => void;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private el: ElementRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {}

  @HostListener('window:resize', ['$event'])
  public onResize(event: ResizeEvent): void {
    this.tableContainerWidth = (this.selectedTh.closest('.table-container') as HTMLElement).offsetWidth;
    this.maxWidth = this.getMaxWidth();
    (
      (Array.from(this.document.querySelectorAll('th')) as HTMLElement[]).filter(
        (th: HTMLElement) => getComputedStyle(th).position === 'sticky'
      ) as HTMLElement[]
    )
      .filter((th: HTMLElement) => th.offsetWidth >= this.tableContainerWidth - this.maxWidth)
      .forEach((th: HTMLElement) => {
        this.renderer.setStyle(th, 'width', this.tableContainerWidth - this.maxWidth + 'px');
      });
    // if (stickyTh.offsetWidth >= this.tableContainerWidth - this.maxWidth) {
    //   this.renderer.setStyle(this.selectedTh, 'width', this.tableContainerWidth - this.maxWidth + 'px');
    //   this.selectedTh.style.width = this.tableContainerWidth - this.maxWidth + 'px';
    //   console.log(this.selectedTh.offsetWidth);
    // }
    console.log('exit');
  }

  @HostListener('mousedown', ['$event'])
  public onMouseDown(event: MouseEvent): void {
    if (!(event.target as HTMLElement).closest('.resize-border')) {
      return;
    }

    const body = document.querySelector('body');

    this.selectedTh = (event.target as HTMLElement).closest('th');
    this.maxWidth = this.getMaxWidth();
    this.mouseMoveFunc = this.changeWidth.bind(this);

    this.document.addEventListener('mouseup', this.onUpMouse.bind(this), { once: true });
    this.document.addEventListener('mousemove', this.mouseMoveFunc);

    this.renderer.setStyle(body, 'user-select', 'none');
    this.renderer.setStyle(body, 'pointer-events', 'none');
  }

  public ngAfterViewInit(): void {
    setTimeout(() => this.addResizeStructure(), 100);
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
      console.log('cond1')
      return;
    }

    if (this.selectedTh.offsetWidth < this.minWidth) {
      this.selectedTh.style.width = `${this.minWidth}px`;
      console.log('cond2')
      return;
    }

    if (this.selectedTh.offsetWidth + event.movementX < this.minWidth) {
      console.log('cond3')
      this.selectedTh.style.width = `${this.minWidth}px`;
    }

    if (this.selectedTh.offsetWidth + event.movementX > this.maxWidth) {
      console.log('cond4')
      return;
    }

    const cur = this.selectedTh.offsetWidth + event.movementX;
    this.selectedTh.style.width = `${cur}px`;
  }

  private addResizeStructure(): void {
    const THs = this.el.nativeElement.getElementsByTagName('th');

    for (let i = 0; i < THs.length - 1; i++) {
      if (THs[i + 1].classList.contains('actions-row')) {
        break;
      }

      const componentRef = this.viewContainerRef.createComponent(StretchCellComponent);
      const content = THs[i].childNodes[0];

      this.renderer.removeChild(THs[i], content);
      componentRef.instance.insertNode(content);

      this.renderer.appendChild(THs[i], componentRef.location.nativeElement);
    }

    for (let i = 0; i < THs.length; i++) {
      THs[i].style.width = `${THs[i].offsetWidth}px`;
    }
  }

  private getMaxWidth(): number {
    this.tableContainerWidth = (this.selectedTh.closest('.table-container') as HTMLElement).offsetWidth;
    const row = this.selectedTh.closest('tr');

    if (!row) {
      return;
    }

    const allThs = Array.from(row.querySelectorAll('th')) as HTMLElement[];
    const selectedIndex = allThs.indexOf(this.selectedTh);
    let widthOfStickyAhead = 0;

    allThs
      .slice(selectedIndex + 1)
      .filter((th: HTMLElement) => getComputedStyle(th).position === 'sticky')
      .forEach((th: HTMLElement) => {
        widthOfStickyAhead += th.offsetWidth;
      });

    return this.tableContainerWidth - widthOfStickyAhead;
  }
}
