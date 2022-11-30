import { ComponentFactoryResolver, ElementRef, Renderer2, ViewContainerRef } from '@angular/core';
import { StretchTableDirective } from './stretch-table.directive';

describe('StretchTableDirective', () => {
  it('should create an instance', () => {
    let el: ElementRef;
    let renderer: Renderer2;
    let cfr: ComponentFactoryResolver;
    let viewContainerRef: ViewContainerRef;
    const directive = new StretchTableDirective(el, cfr, renderer, viewContainerRef);
    expect(directive).toBeTruthy();
  });
});
