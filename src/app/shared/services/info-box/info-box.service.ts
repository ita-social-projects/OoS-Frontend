import { ComponentFactoryResolver, ComponentRef, Injectable, Type, ViewContainerRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChildInfoBoxComponent } from '../../components/child-info-box/child-info-box.component';
import { Child } from '../../models/child.model';

@Injectable({
  providedIn: 'root'
})
export class InfoBoxService {

  private isMouseOver = new BehaviorSubject(false);
  isMouseOver$ = this.isMouseOver.asObservable();
  child: Child;
  top: string;
  left: string;

  constructor(private cfr: ComponentFactoryResolver) { }

  onMouseOver({ element, child}: { element: Element, child: Child}): void {
    this.isMouseOver.next(true);
    this.child = child;
    this.getPosition(element);
  }

  onMouseLeave(): void {
    this.isMouseOver.next(false);
  }

  async loadComponent(vcr: ViewContainerRef, isMouseOver: boolean): Promise<ComponentRef<ChildInfoBoxComponent>> {
    const { ChildInfoBoxComponent } = await import('../../components/child-info-box/child-info-box.component');

    vcr.clear();
    const component: Type<ChildInfoBoxComponent> = ChildInfoBoxComponent;
    if (isMouseOver) {
      const componentRef = vcr.createComponent(this.cfr.resolveComponentFactory(component));
      (componentRef.instance as ChildInfoBoxComponent).child = this.child ? this.child : null;
      (componentRef.instance as ChildInfoBoxComponent).top = this.top ? this.top : null;
      (componentRef.instance as ChildInfoBoxComponent).left = this.left ? this.left : null;
      return componentRef;
    }
  }

  /**
    * This method get position pf emitted element
    * @param Element element
    */
  getPosition(element: Element): void {
    const bodyRect = document.body.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    const offset = (bodyRect.height - elementRect.top < 331) ? elementRect.top - bodyRect.top - 361 : elementRect.top - bodyRect.top + 20
    this.top = offset + 'px';
    this.left = elementRect.left + 'px';
  }
}
