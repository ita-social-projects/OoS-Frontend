import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appInfoBoxHost]'
})
export class InfoBoxHostDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
