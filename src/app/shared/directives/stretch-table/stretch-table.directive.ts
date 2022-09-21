import { AfterViewInit, ComponentFactoryResolver, Directive, ElementRef, HostListener, Renderer2, ViewContainerRef } from '@angular/core';
import { StretchCellComponent } from '../../components/stretch-cell/stretch-cell/stretch-cell.component';

@Directive({
  selector: '[appStretchTable]'
})
export class StretchTableDirective implements AfterViewInit{
  private selectedTh!: any;
  private tableContainerWidth!: any;
  private mouseMoveFunc!: any;
  private startColWidth!: any;

  constructor(
    private el: ElementRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) { }
  
  ngAfterViewInit(): void {
    let THs = this.el.nativeElement.getElementsByTagName('th');
    
    for(let i = 0; i < THs.length - 1; i++){
      
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(StretchCellComponent);
      let componentRef = this.viewContainerRef.createComponent(componentFactory);
      let content = THs[i].childNodes[0];

      this.renderer.removeChild(THs[i], content);
      componentRef.instance.insertNode(content);
      this.renderer.appendChild(THs[i], componentRef.location.nativeElement);
    }
  }
  
  @HostListener('mousedown',['$event']) onMouseDown(event: any){
    if(!event.target.closest(".resize-border")){
      return;
    }
    this.selectedTh = event.target.closest("th");
    this.tableContainerWidth = this.selectedTh.closest('.table-container').offsetWidth;
    this.mouseMoveFunc = this.changeWidth.bind(this);
    document.addEventListener('mouseup', this.onUpMouse.bind(this), {once: true})
    document.addEventListener('mousemove', this.mouseMoveFunc);
    document.querySelector('body')!.style.userSelect = 'none';
    document.querySelector('body')!.style.pointerEvents = 'none';
  }

  private onUpMouse(){
    document.removeEventListener('mousemove', this.mouseMoveFunc);
    document.querySelector('body')!.style.userSelect = 'auto';
    document.querySelector('body')!.style.pointerEvents = 'auto';
  }

  private changeWidth(event: any){
    let minWidth = 50;
    let nextEl = this.selectedTh.nextElementSibling;
    let tableWidth = this.selectedTh.closest('table').offsetWidth;
    if(event.movementX === 0){
      return;
    }
    if(nextEl.offsetWidth <= minWidth && event.movementX > 0){
      return;
    }
    if(this.selectedTh.offsetWidth <= minWidth && event.movementX < 0){
      return;
    }
    if(this.selectedTh.classList.contains('mat-table-sticky')
        && !(tableWidth + event.movementX < this.tableContainerWidth)
        && nextEl.offsetWidth < this.startColWidth
      ){
      this.selectedTh.style.width = `${this.selectedTh.offsetWidth + event.movementX}px`;
      return;
    }
    if(nextEl.offsetWidth - event.movementX < minWidth){
      this.selectedTh.style.width = `${this.selectedTh.offsetWidth + (nextEl.offsetWidth - minWidth)}px`;
      nextEl.style.width = `${minWidth}px`;
      return;
    }
    if(this.selectedTh.offsetWidth + event.movementX < minWidth){
      nextEl.style.width = `${nextEl.offsetWidth + (this.selectedTh.offsetWidth - minWidth)}px`;
      this.selectedTh.style.width = `${minWidth}px`;
      return;
    }
    let next = nextEl.offsetWidth - event.movementX;
    let cur = this.selectedTh.offsetWidth + event.movementX;
    nextEl.style.width = `${next}px`;
    this.selectedTh.style.width = `${cur}px`;
  }
}
