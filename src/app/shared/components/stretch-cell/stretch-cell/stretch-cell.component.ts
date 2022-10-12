import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-stretch-cell',
  templateUrl: './stretch-cell.component.html',
  styleUrls: ['./stretch-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StretchCellComponent {

  constructor(private cdr: ChangeDetectorRef, private renderer: Renderer2, private el: ElementRef) { }

  insertNode(node: Node) {
    this.renderer.insertBefore(this.el.nativeElement.childNodes[0], node, this.el.nativeElement.getElementsByClassName('resize-border')[0]);
    this.cdr.detectChanges();
  }
}
