import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-stretch-cell',
  templateUrl: './stretch-cell.component.html',
  styleUrls: ['./stretch-cell.component.scss']
})
export class StretchCellComponent implements OnInit {

  constructor(private cdr: ChangeDetectorRef, private renderer: Renderer2, private el: ElementRef) { }

  ngOnInit(): void {
  }

  public insertNode(node: any){
    this.renderer.insertBefore(this.el.nativeElement.childNodes[0], node, this.el.nativeElement.getElementsByClassName('resize-border')[0]);
    this.cdr.detectChanges();
  }
}
