import { AfterViewInit, ComponentFactoryResolver, Directive, ElementRef, HostListener, Renderer2, ViewContainerRef } from '@angular/core';
import { StretchCellComponent } from '../../components/stretch-cell/stretch-cell/stretch-cell.component';

@Directive({
  selector: '[appStretchTable]'
})
export class StretchTableDirective implements AfterViewInit {
  private selectedTh!: HTMLElement;
  private tableContainerWidth!: number;
  private mouseMoveFunc!: (event: MouseEvent) => void;

  constructor(
    private el: ElementRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {}

  @HostListener('mousedown', ['$event'])
  public onMouseDown(event: MouseEvent): void {
    if (!(event.target as HTMLElement).closest('.resize-border')) {
      return;
    }

    const body = document.querySelector('body');

    this.selectedTh = (event.target as HTMLElement).closest('th');
    this.tableContainerWidth = (this.selectedTh.closest('.table-container') as HTMLElement).offsetWidth;
    this.mouseMoveFunc = this.changeWidth.bind(this);

    document.addEventListener('mouseup', this.onUpMouse.bind(this), { once: true });
    document.addEventListener('mousemove', this.mouseMoveFunc);

    body.style.userSelect = 'none';
    body.style.pointerEvents = 'none';
  }

  public ngAfterViewInit(): void {
    setTimeout(() => this.addResizeStructure(), 100);
  }

  private onUpMouse(): void {
    document.removeEventListener('mousemove', this.mouseMoveFunc);
    const body = document.querySelector('body');
    body.style.userSelect = 'auto';
    body.style.pointerEvents = 'auto';
  }

  private changeWidth(event: MouseEvent): void {
    const minWidth = 50;
    const tableWidth = this.selectedTh.closest('table').offsetWidth;

    if (event.movementX === 0) {
      return;
    }

    if ((this.selectedTh.offsetWidth <= minWidth || tableWidth <= this.tableContainerWidth) && event.movementX < 0) {
      return;
    }

    if (tableWidth > this.tableContainerWidth && tableWidth + event.movementX < this.tableContainerWidth) {
      const width = this.selectedTh.offsetWidth - (tableWidth - this.tableContainerWidth);
      this.selectedTh.style.width = `${width}px`;
      return;
    }

    if (this.selectedTh.offsetWidth + event.movementX < minWidth) {
      this.selectedTh.style.width = `${minWidth}px`;
      return;
    }

    const cur = this.selectedTh.offsetWidth + event.movementX;
    this.selectedTh.style.width = `${cur}px`;
  }

  private addResizeStructure(): void {
    const THs = this.el.nativeElement.getElementsByTagName('th');

    for (let i = 0; i < THs.length - 1; i++) {
      if (THs[i + 1].classList.contains('mat-table-sticky') && THs[i + 1].classList.contains('mat-table-sticky-border-elem-right')) {
        break;
      }

      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(StretchCellComponent);
      // TODO: Update to use without ComponentFactoryResolver
      const componentRef = this.viewContainerRef.createComponent(componentFactory);
      const content = THs[i].childNodes[0];

      this.renderer.removeChild(THs[i], content);
      componentRef.instance.insertNode(content);

      this.renderer.appendChild(THs[i], componentRef.location.nativeElement);
    }

    for (let i = 0; i < THs.length; i++) {
      THs[i].style.width = `${THs[i].offsetWidth}px`;
    }
  }
}
