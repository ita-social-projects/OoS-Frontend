import { Component, ComponentFactoryResolver, Injectable, Type, ViewContainerRef } from '@angular/core';
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

  onMouseOver({ element, child }: { element: Element, child: Child }): void {
    this.isMouseOver.next(true);
    this.child = child;
    this.getPosition(element);
  }

  onMouseLeave(): void {
    this.isMouseOver.next(false);
  }

  async loadComponent(vcr: ViewContainerRef, isMouseOver: boolean) {
    const { ChildInfoBoxComponent } = await import('../../components/child-info-box/child-info-box.component');

    vcr.clear();
    const component: Type<ChildInfoBoxComponent> = ChildInfoBoxComponent;
    if (isMouseOver) {
      const componentRef = vcr.createComponent(this.cfr.resolveComponentFactory(component));

      (<ChildInfoBoxComponent>componentRef.instance).child = this.child ? this.child : null;
      (<ChildInfoBoxComponent>componentRef.instance).top = this.top ? this.top : null;
      (<ChildInfoBoxComponent>componentRef.instance).left = this.left ? this.left : null;

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
    const offset = elementRect.top - bodyRect.top + 20;
    this.top = offset + 'px';
    this.left = elementRect.left + 'px';
  }
}
